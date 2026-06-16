import { useState } from 'react';

const GROUP_ORDER = [
  'Daily essentials',
  'Trip-level costs',
  'Lifestyle & discretionary',
  'Easy-to-forget hidden costs'
];

export default function BasketChecklist({ items, basket, onChange, defaultNights = 1 }) {
  const [openGroups, setOpenGroups] = useState({});

  function toggleGroup(name) {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function isChecked(itemId) {
    return basket.some((b) => b.item_id === itemId);
  }

  function quantityOf(itemId) {
    return basket.find((b) => b.item_id === itemId)?.quantity ?? 1;
  }

  function toggleItem(item) {
    if (isChecked(item.id)) {
      onChange(basket.filter((b) => b.item_id !== item.id));
    } else {
      const initialQuantity = item.category === 'Stay' ? defaultNights : 1;
      onChange([...basket, { item_id: item.id, quantity: initialQuantity }]);
    }
  }

  function setQuantity(itemId, quantity) {
    onChange(basket.map((b) => (b.item_id === itemId ? { ...b, quantity: Math.max(1, quantity) } : b)));
  }

  const groups = GROUP_ORDER.map((groupName) => {
    const groupItems = items.filter((i) => i.group_name === groupName);
    const subgroupNames = [...new Set(groupItems.map((i) => i.category))];
    return {
      name: groupName,
      total: groupItems.length,
      checked: groupItems.filter((i) => isChecked(i.id)).length,
      subgroups: subgroupNames.map((sub) => ({
        name: sub,
        items: groupItems.filter((i) => i.category === sub)
      }))
    };
  }).filter((g) => g.total > 0);

  const totalItems = items.length;

  return (
    <div className="checklist">
      <div className="checklist-header">
        <h3>Travel basket checklist</h3>
        <span className="checklist-total">{basket.length} / {totalItems} checked</span>
      </div>

      {groups.map((group) => (
        <div key={group.name} className="checklist-group">
          <button
            type="button"
            className={`checklist-group-header ${openGroups[group.name] ? 'open' : ''}`}
            onClick={() => toggleGroup(group.name)}
          >
            <span className="checklist-group-title">
              <span className="chevron">▶</span>
              {group.name}
            </span>
            <span className="checklist-group-count">{group.checked}/{group.total}</span>
          </button>

          <div className={`checklist-group-content ${openGroups[group.name] ? 'open' : ''}`}>
            {group.subgroups.map((sub) => (
              <div key={sub.name}>
                {sub.name !== group.name && <div className="checklist-sub">{sub.name}</div>}
                {sub.items.map((item) => {
                  const checked = isChecked(item.id);
                  return (
                    <div key={item.id} className={`checklist-item ${checked ? 'checked' : ''}`}>
                      <label className="checklist-item-label">
                        <input type="checkbox" checked={checked} onChange={() => toggleItem(item)} />
                        <span>{item.name}</span>
                        {item.pricing_model === 'percentage' && <span className="pct-pill">%</span>}
                      </label>
                      {checked && item.pricing_model === 'unit' && (
                        <div className="qty-stepper">
                          <button type="button" onClick={() => setQuantity(item.id, quantityOf(item.id) - 1)}>−</button>
                          <span>{quantityOf(item.id)}</span>
                          <button type="button" onClick={() => setQuantity(item.id, quantityOf(item.id) + 1)}>+</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
