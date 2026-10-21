import { Quote, Star } from 'lucide-react'
import { SectionHeading } from './section-heading'

const PARTNERS = ['VINAFOOD', 'Lotus Cosmetics', 'SAIGON PHARMA', 'GreenLeaf', 'MekongTea', 'NOVA ELEC', 'An Phát Retail', 'Hoàng Gia']

const TESTIMONIALS = [
  {
    quote:
      'PML giữ màu thương hiệu ổn định qua hơn 20 lô hộp mỹ phẩm, sai lệch gần như bằng không. Tiến độ luôn sớm hơn cam kết 1–2 ngày.',
    name: 'Nguyễn Thu Hà',
    role: 'Trưởng phòng Thu mua',
    company: 'Lotus Cosmetics',
  },
  {
    quote:
      'Chuyển toàn bộ nhãn decal cuộn sang PML giúp chúng tôi giảm 18% chi phí bao bì mỗi năm mà vẫn chạy tốt trên dây chuyền dán tự động.',
    name: 'Trần Minh Quân',
    role: 'Giám đốc Chuỗi cung ứng',
    company: 'MekongTea',
  },
  {
    quote:
      'Đội ngũ kỹ thuật tư vấn kết cấu hộp rất chuyên nghiệp. Mùa Tết cần 300.000 hộp quà trong 3 tuần, PML vẫn giao đủ và đúng chuẩn.',
    name: 'Lê Hoàng Phúc',
    role: 'Giám đốc Marketing FMCG',
    company: 'VINAFOOD',
  },
]

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="border-t border-border bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Được tin chọn bởi 500+ thương hiệu
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          {PARTNERS.map((p) => (
            <li
              key={p}
              className="grid h-20 place-items-center bg-white px-4 text-center text-base font-extrabold tracking-tight text-slate-600 transition-colors hover:text-foreground"
            >
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-20">
          <SectionHeading
            id="testimonials-title"
            eyebrow="Khách hàng nói về PML"
            title="Đối tác tin cậy của các nhà quản lý thu mua"
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <li key={t.name}>
                <figure className="flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-lg hover:shadow-slate-900/5 md:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5" aria-label="Đánh giá 5 trên 5 sao" role="img">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-4 fill-cta text-cta" aria-hidden="true" />
                      ))}
                    </div>
                    <Quote className="size-8 text-slate-200" aria-hidden="true" />
                  </div>
                  <blockquote className="mt-5 flex-1 text-pretty leading-relaxed text-foreground">
                    {`“${t.quote}”`}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    <span
                      aria-hidden="true"
                      className="grid size-10 place-items-center rounded-full bg-navy text-sm font-bold text-white"
                    >
                      {t.name.split(' ').pop()?.[0]}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{t.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {t.role}, {t.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
