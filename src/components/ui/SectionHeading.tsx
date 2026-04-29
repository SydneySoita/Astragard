import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  className?: string;
  light?: boolean;
}

export function SectionHeading({ title, subtitle, gradient = false, className, light = false }: SectionHeadingProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={cn(
        "text-center mb-12 md:mb-16 transition-all duration-1000",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      <h2
        className={cn(
          "font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight",
          gradient ? "gradient-text" : light ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "mt-4 max-w-2xl mx-auto text-lg font-body",
          light ? "text-primary-foreground/60" : "text-muted-foreground"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
