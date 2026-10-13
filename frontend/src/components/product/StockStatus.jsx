import Icon from "../ui/Icon.jsx";

export default function StockStatus({ stock }) {
  if (stock <= 0) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-rose-600">
        <Icon name="circleX" />
        Out of Stock
      </p>
    );
  }

  if (stock <= 10) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-amber-600">
        <Icon name="check" />
        Low Stock — only {stock} left
      </p>
    );
  }

  return (
    <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
      <Icon name="check" />
      In Stock
    </p>
  );
}
