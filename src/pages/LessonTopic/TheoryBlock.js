import {
  CircleCheck,
  CircleX,
  AlertTriangle,
  Info,
} from 'lucide-react';

const CALLOUT_ICONS = {
  positive: CircleCheck,
  negative: CircleX,
  warning: AlertTriangle,
  info: Info,
};

function renderInline(text) {
  if (!text || !text.includes('**')) return text;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

/**
 * Renders one block from parseTheoryText() output for a lesson topic.
 */
export function TheoryBlock({ block }) {
  switch (block.type) {
    case 'heading':
      return <h3 className="theory__heading">{block.content}</h3>;

    case 'paragraph':
      return <p className="theory__paragraph">{renderInline(block.content)}</p>;

    case 'bullets':
      return (
        <ul className="theory__bullets">
          {block.items.map((item, i) => (
            <li key={i} className="theory__bulletItem">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );

    case 'numbered':
      return (
        <ol className="theory__numbered">
          {block.items.map((item, i) => (
            <li key={i} className="theory__numberedItem">
              <span className="theory__stepNum">{i + 1}</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );

    case 'callout': {
      const variantClass = `theory__callout--${block.variant}`;
      const CalloutIcon = CALLOUT_ICONS[block.variant] || Info;
      return (
        <div className={`theory__callout ${variantClass}`}>
          <div className="theory__calloutHeader">
            <span className={`theory__calloutIcon theory__calloutIcon--${block.variant}`}>
              <CalloutIcon size={18} />
            </span>
            <span className="theory__calloutTitle">{block.title}</span>
          </div>
          {block.body && (
            <div className="theory__calloutBody">
              {block.body.type === 'bullets' && (
                <ul className="theory__bullets">
                  {block.body.items.map((item, i) => (
                    <li key={i} className="theory__bulletItem">
                      {renderInline(item)}
                    </li>
                  ))}
                </ul>
              )}
              {block.body.type === 'numbered' && (
                <ol className="theory__numbered">
                  {block.body.items.map((item, i) => (
                    <li key={i} className="theory__numberedItem">
                      <span className="theory__stepNum">{i + 1}</span>
                      <span>{renderInline(item)}</span>
                    </li>
                  ))}
                </ol>
              )}
              {block.body.type === 'text' && (
                <p className="theory__paragraph">{renderInline(block.body.content)}</p>
              )}
            </div>
          )}
        </div>
      );
    }

    default:
      return null;
  }
}
