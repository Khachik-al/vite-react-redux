import { convertToBase64 } from '../utils/convertToBase64'

export const useHandleImageUpload = async (
  payload: File[],
) => {
  const base64 = await Promise.all(payload.map((item: File) => convertToBase64(item)))
  return base64
}
