type SectionRibbonProps = {
  children: string;
  id?: string;
};

export function SectionRibbon({ children, id }: SectionRibbonProps) {
  return (
    <div className="section-ribbon" id={id}>
      <span>{children}</span>
    </div>
  );
}
