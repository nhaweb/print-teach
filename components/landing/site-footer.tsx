import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Logo } from './logo'
import { googleMapsUrl } from '@/lib/maps'

const LINK_GROUPS = [
  {
    title: 'Dịch vụ in ấn',
    links: ['In hộp giấy cao cấp', 'In hộp carton sóng', 'In túi giấy thương hiệu', 'In hộp quà tặng (Gift box)'],
  },
  {
    title: 'Bao bì & Nhãn',
    links: ['In tem nhãn decal cuộn', 'In tem bảo hành, chống giả', 'Túi màng phức hợp', 'Khay nhựa định hình'],
  },
  {
    title: 'Về PML',
    links: ['Năng lực nhà máy', 'Chứng nhận ISO 9001:2015', 'Quy trình đặt hàng', 'Tuyển dụng'],
  },
]

const LOCATIONS = [
  { label: 'Văn phòng', address: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh' },
  { label: 'Nhà máy 1', address: 'Lô B5, KCN Tân Tạo, Bình Tân, TP. Hồ Chí Minh' },
  { label: 'Nhà máy 2', address: 'Lô C12, KCN VSIP II, Thủ Dầu Một, Bình Dương' },
]

export function SiteFooter() {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              Công ty TNHH PML Việt Nam — Nhà sản xuất bao bì & in ấn công nghiệp khép kín, phục vụ hơn 500 doanh
              nghiệp trong và ngoài nước.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a href="tel:0901234567" className="inline-flex items-center gap-2.5 hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Phone className="size-4 text-cta" aria-hidden="true" />
                  Hotline: <span className="font-semibold text-white">0901 234 567</span>
                </a>
              </li>
              <li>
                <a href="https://zalo.me/0901234567" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <MessageCircle className="size-4 text-cta" aria-hidden="true" />
                  Zalo OA: PML PrintTech
                </a>
              </li>
              <li>
                <a href="mailto:baogia@pmlvietnam.vn" className="inline-flex items-center gap-2.5 hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Mail className="size-4 text-cta" aria-hidden="true" />
                  baogia@pmlvietnam.vn
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Liên kết chân trang" className="grid gap-8 sm:grid-cols-3">
            {LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-bold text-white">{group.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="/#dich-vu" className="text-sm text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <address className="mt-12 grid gap-4 border-t border-white/10 pt-10 not-italic sm:grid-cols-3">
          {LOCATIONS.map((loc) => (
            <div key={loc.label} className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-cta" aria-hidden="true" />
              <p className="text-sm leading-relaxed">
                <span className="block font-semibold text-white">{loc.label}</span>
                <span className="text-slate-400">{loc.address}</span>
                <a
                  href={googleMapsUrl(loc.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Xem bản đồ ${loc.label}: ${loc.address} (mở tab mới)`}
                  className="mt-1 block w-fit text-xs font-semibold text-cta underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Xem bản đồ
                </a>
              </p>
            </div>
          ))}
        </address>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} PML Vietnam. Bảo lưu mọi quyền.</p>
          <p>MST: 0312345678 — Sở KH&ĐT TP. Hồ Chí Minh cấp</p>
        </div>
      </div>
    </footer>
  )
}
