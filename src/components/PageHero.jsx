export default function PageHero({ kicker, kickerIcon: KickerIcon, title, accent, lead, children }) {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-16 md:pt-20 pb-10 text-center">
      <div className="scs-reveal is-visible max-w-2xl mx-auto">
        {kicker && (
          <span className="scs-kicker-badge mb-6">
            {KickerIcon ? <KickerIcon size={13} /> : null}
            {kicker}
          </span>
        )}
        <h1 className="scs-h1 text-3xl md:text-4xl mb-5">
          {title} {accent && <span className="scs-accent">{accent}</span>}
        </h1>
        {lead && <p className="scs-lead text-base md:text-lg max-w-xl mx-auto">{lead}</p>}
        {children}
      </div>
    </section>
  )
}
