/** GitHub Pages project path. next/image does not prefix public files under `output: 'export'`. */
export const BASE_PATH = "/HotelManagment-WebAPI"

export function withBasePath(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path
  }
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`
}
