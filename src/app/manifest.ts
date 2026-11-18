import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Grey Dot. Coffee Shop — Drive-Thru & To-Go',
    short_name: 'Grey Dot',
    description: 'Digital express menu and live drive-thru dispatch for Grey Dot Coffee Shop, Ram Chowk, Mota Varachha, Surat.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0d10',
    theme_color: '#6ec6f1',
    icons: [
      {
        src: '/grey_dot_logo_straight.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/grey_dot_logo_straight.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
