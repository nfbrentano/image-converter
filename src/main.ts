import './style.css'
import { convert } from 'heiccon'
import JSZip from 'jszip'

interface FileItem {
  id: string
  file: File
  preview: string
  status: 'pending' | 'converting' | 'completed' | 'error'
  progress: number
  convertedBlob?: Blob
  error?: string
}

class ImageConverter {
  private files: FileItem[] = []
  private dropzone: HTMLElement
  private fileInput: HTMLInputElement
  private fileList: HTMLElement
  private controls: HTMLElement
  private formatSelect: HTMLSelectElement
  private qualitySlider: HTMLInputElement
  private qualityValue: HTMLElement
  private convertAllBtn: HTMLButtonElement
  private downloadZipBtn: HTMLButtonElement

  constructor() {
    this.dropzone = document.getElementById('dropzone')!
    this.fileInput = document.getElementById('fileInput') as HTMLInputElement
    this.fileList = document.getElementById('file-list')!
    this.controls = document.getElementById('conversion-controls')!
    this.formatSelect = document.getElementById('formatSelect') as HTMLSelectElement
    this.qualitySlider = document.getElementById('qualitySlider') as HTMLInputElement
    this.qualityValue = document.getElementById('qualityValue')!
    this.convertAllBtn = document.getElementById('convertAllBtn') as HTMLButtonElement
    this.downloadZipBtn = document.getElementById('downloadZipBtn') as HTMLButtonElement

    this.initEvents()
  }

  private initEvents() {
    this.dropzone.addEventListener('click', () => this.fileInput.click())
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e))
    
    this.dropzone.addEventListener('dragover', (e) => {
      e.preventDefault()
      this.dropzone.classList.add('drag-over')
    })
    
    this.dropzone.addEventListener('dragleave', () => {
      this.dropzone.classList.remove('drag-over')
    })
    
    this.dropzone.addEventListener('drop', (e) => {
      e.preventDefault()
      this.dropzone.classList.remove('drag-over')
      if (e.dataTransfer?.files) {
        this.addFiles(Array.from(e.dataTransfer.files))
      }
    })

    this.qualitySlider.addEventListener('input', () => {
      this.qualityValue.textContent = this.qualitySlider.value
    })

    this.convertAllBtn.addEventListener('click', () => this.convertAll())
    this.downloadZipBtn.addEventListener('click', () => this.downloadZip())
  }

  private handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement
    if (input.files) {
      this.addFiles(Array.from(input.files))
    }
  }

  private async addFiles(newFiles: File[]) {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/') || 
                                              file.name.toLowerCase().endsWith('.heic') || 
                                              file.name.toLowerCase().endsWith('.heif'))
    
    for (const file of imageFiles) {
      const id = Math.random().toString(36).substring(7)
      const preview = await this.createPreview(file)
      
      this.files.push({
        id,
        file,
        preview,
        status: 'pending',
        progress: 0
      })
    }

    this.updateUI()
  }

  private createPreview(file: File): Promise<string> {
    return new Promise((resolve) => {
      if (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
        // For HEIC, we can't show a preview directly easily without converting first
        // We'll show a placeholder or convert a small version
        resolve('https://placehold.co/100x100/1e293b/6366f1?text=HEIC')
      } else {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      }
    })
  }

  private updateUI() {
    if (this.files.length > 0) {
      this.controls.classList.remove('hidden')
    } else {
      this.controls.classList.add('hidden')
    }

    this.fileList.innerHTML = this.files.map(file => `
      <div class="file-card" data-id="${file.id}">
        <img src="${file.preview}" class="file-preview" alt="Preview">
        <div class="file-info">
          <span class="file-name" title="${file.file.name}">${file.file.name}</span>
          <span class="file-meta">${(file.file.size / 1024 / 1024).toFixed(2)} MB</span>
          <div class="file-status">
            ${file.status === 'pending' ? '<span class="status-badge">Pronto</span>' : 
              file.status === 'converting' ? `
                <div class="progress-bar"><div class="progress-fill" style="width: ${file.progress}%"></div></div>
              ` : 
              file.status === 'completed' ? '<span class="status-badge" style="color: #10b981">Concluído</span>' : 
              `<span class="status-badge" style="color: #ef4444">Erro</span>`}
          </div>
        </div>
        <button class="remove-btn" onclick="window.app.removeFile('${file.id}')">✕</button>
        ${file.status === 'completed' ? `
          <div class="file-actions">
            <a href="${URL.createObjectURL(file.convertedBlob!)}" download="${this.getOutputFileName(file)}" class="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </a>
          </div>
        ` : ''}
      </div>
    `).join('')

    // Check if all are completed to show ZIP btn
    const allCompleted = this.files.length > 0 && this.files.every(f => f.status === 'completed')
    if (allCompleted) {
      this.downloadZipBtn.classList.remove('hidden')
    } else {
      this.downloadZipBtn.classList.add('hidden')
    }
  }

  public removeFile(id: string) {
    this.files = this.files.filter(f => f.id !== id)
    this.updateUI()
  }

  private getOutputFileName(fileItem: FileItem): string {
    const nameParts = fileItem.file.name.split('.')
    nameParts.pop()
    const extension = this.formatSelect.value.split('/')[1]
    return `${nameParts.join('.')}.${extension}`
  }

  private async convertAll() {
    this.convertAllBtn.disabled = true
    this.convertAllBtn.textContent = 'Convertendo...'

    for (const fileItem of this.files) {
      if (fileItem.status === 'completed') continue
      
      fileItem.status = 'converting'
      fileItem.progress = 10
      this.updateUI()

      try {
        const convertedBlob = await this.convertSingleFile(fileItem)
        fileItem.status = 'completed'
        fileItem.convertedBlob = convertedBlob
        fileItem.progress = 100
      } catch (err) {
        console.error(err)
        fileItem.status = 'error'
        fileItem.error = 'Falha na conversão'
      }
      this.updateUI()
    }

    this.convertAllBtn.disabled = false
    this.convertAllBtn.textContent = 'Converter Todas'
  }

  private async convertSingleFile(fileItem: FileItem): Promise<Blob> {
    const targetFormat = this.formatSelect.value
    const quality = parseInt(this.qualitySlider.value) / 100

    let sourceBlob: Blob = fileItem.file

    // Handle HEIC
    if (fileItem.file.name.toLowerCase().endsWith('.heic') || fileItem.file.name.toLowerCase().endsWith('.heif')) {
      try {
        const converted = await convert(fileItem.file, {
          format: 'png'
        })
        sourceBlob = converted.blob
      } catch (e) {
        console.error('HEIC conversion error:', e)
        throw new Error('Could not parse HEIF file')
      }
    }

    // Use Canvas for final formatting and quality control
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject('Canvas context error')
        
        ctx.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject('Conversion failed')
        }, targetFormat, quality)
      }
      img.onerror = () => reject('Image load error')
      img.src = URL.createObjectURL(sourceBlob)
    })
  }

  private async downloadZip() {
    const zip = new JSZip()
    this.files.forEach(file => {
      if (file.convertedBlob) {
        zip.file(this.getOutputFileName(file), file.convertedBlob)
      }
    })

    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = 'images_converted.zip'
    a.click()
    URL.revokeObjectURL(url)
  }
}

// Global exposure for the remove button
const app = new ImageConverter()
;(window as any).app = app
