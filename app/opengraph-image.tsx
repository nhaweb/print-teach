import { ImageResponse } from 'next/og'

export const alt = 'PML PrintTech — Sản xuất bao bì & in ấn công nghiệp khép kín'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', width: 120, height: 8, background: '#f97316', borderRadius: 4 }} />
        <div style={{ display: 'flex', marginTop: 40, fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>PML PrintTech</div>
        <div style={{ display: 'flex', marginTop: 24, fontSize: 44, color: '#cbd5e1' }}>
          Sản xuất bao bì & in ấn công nghiệp khép kín
        </div>
        <div style={{ display: 'flex', marginTop: 48, fontSize: 30, color: '#f97316' }}>
          Hộp giấy · Túi giấy · Tem nhãn · Màng phức hợp
        </div>
      </div>
    ),
    size,
  )
}
