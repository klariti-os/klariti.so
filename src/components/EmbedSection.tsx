import PillButton from "@/components/PillButton";

interface EmbedSectionProps {
  title: string;
  description: string;
  embedSrc: string;
  buttonHref: string;
  buttonText: string;
  allowAttributes?: string;
}

const EmbedSection: React.FC<EmbedSectionProps> = ({
  title,
  description,
  embedSrc,
  buttonHref,
  buttonText,
  allowAttributes = "fullscreen",
}) => {
  return (
    <div className="mt-16 first:mt-0">
      <h1 className="text-xl font-medium">{title}</h1>
      <p className="mt-4">{description}</p>

      <div className="flex flex-col max-w-3xl space-y-2">
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 0,
            paddingTop: "56.25%",
            paddingBottom: 0,
            boxShadow: "0 2px 20px 20px rgba(137, 156, 173, 0.16)",
            marginTop: "1.6em",
            marginBottom: "0.9em",
            overflow: "hidden",
            borderRadius: "8px",
            willChange: "transform",
          }}
        >
          <iframe
            loading="lazy"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              border: "none",
              padding: 0,
              margin: 0,
            }}
            src={embedSrc}
            allowFullScreen
            allow={allowAttributes}
          ></iframe>
        </div>
        <a
          href={buttonHref}
          target="_blank"
          rel="noopener"
        >
          <PillButton>{buttonText}</PillButton>
        </a>
      </div>
    </div>
  );
};

export default EmbedSection;
