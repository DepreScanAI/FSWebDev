import PropTypes from 'prop-types';
export default function ChartLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

ChartLabel.propTypes = { children: PropTypes.node.isRequired };
