export function getGoogleMapsDirectionsUrl(destination: string): string {
  const dest = encodeURIComponent(destination.trim())
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`
}
