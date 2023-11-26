export const convertToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') resolve(fileReader.result)
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
