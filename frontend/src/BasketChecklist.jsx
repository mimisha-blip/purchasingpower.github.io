import { useState } from 'react';
import { getItemUnit, pluralizeUnit, getTierGroupLabel, getTierLabel } from './itemUnits.js';

const GROUP_ORDER = [
  'Daily essentials',
  'Trip-level costs',
  'Lifestyle & discretionary',
  'Easy-to-forget hidden costs'
];

// Collapses items sharing a tier-group label (e.g. the 5 "Mobile data
// plan — *" items) into a single slot, in first-occurrence order, so they
// render as one checkbox + dropdown instead of 5 separate checkboxes.
function buildSlots(items) {
  const slots = [];
  const tierGroupIndex = new Map();
  for (const item of items) {
    const tierLabel = getTierGroupLabel(item);
    if (!tierLabel) {
      slots.push({ type: 'item', item });
      continue;
    }
    if (tierGroupIndex.has(tierLabel)) {
      slots[tierGroupIndex.get(tierLabel)].tiers.push(item);
    } else {
      tierGroupIndex.set(tierLabel, slots.length);
      slots.push({ type: 'tier-group', label: tierLabel, tiers: [item] });
    }
  }
  return slots;
}

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

  function defaultQuantityFor(item) {
    const { perTripDays, perTripWeeks } = getItemUnit(item);
    if (perTripDays) return Math.max(1, defaultNights);
    if (perTripWeeks) return Math.max(1, Math.ceil(defaultNights / 7));
    return 1;
  }

  function toggleItem(item) {
    if (isChecked(item.id)) {
      onChange(basket.filter((b) => b.item_id !== item.id));
    } else {
      onChange([...basket, { item_id: item.id, quantity: defaultQuantityFor(item) }]);
    }
  }

  function setQuantity(itemId, quantity) {
    onChange(basket.map((b) => (b.item_id === itemId ? { ...b, quantity: Math.max(1, quantity) } : b)));
  }

  function selectedTier(tiers) {
    return tiers.find((t) => isChecked(t.id)) ?? null;
  }

  function toggleTierGroup(tiers) {
    const selected = selectedTier(tiers);
    if (selected) {
      onChange(basket.filter((b) => !tiers.some((t) => t.id === b.item_id)));
    } else {
      const defaultTier = tiers[0];
      onChange([...basket, { item_id: defaultTier.id, quantity: defaultQuantityFor(defaultTier) }]);
    }
  }

  function changeTier(tiers, newItemId) {
    const newItem = tiers.find((t) => t.id === Number(newItemId));
    const withoutOldTiers = basket.filter((b) => !tiers.some((t) => t.id === b.item_id));
    onChange([...withoutOldTiers, { item_id: newItem.id, quantity: defaultQuantityFor(newItem) }]);
  }

  function isSlotChecked(slot) {
    return slot.type === 'item' ? isChecked(slot.item.id) : selectedTier(slot.tiers) !== null;
  }

  const groups = GROUP_ORDER.map((groupName) => {
    const groupItems = items.filter((i) => i.group_name === groupName);
    const subgroupNames = [...new Set(groupItems.map((i) => i.category))];
    const subgroups = subgroupNames.map((sub) => ({
      name: sub,
      slots: buildSlots(groupItems.filter((i) => i.category === sub))
    }));
    const allSlots = subgroups.flatMap((sub) => sub.slots);
    return {
      name: groupName,
      total: allSlots.length,
      checked: allSlots.filter(isSlotChecked).length,
      subgroups
    };
  }).filter((g) => g.total > 0);

  const totalItems = groups.reduce((sum, g) => sum + g.total, 0);
  const totalChecked = groups.reduce((sum, g) => sum + g.checked, 0);

  return (
    <div className="checklist">
      <div className="checklist-header">
        <h3>Travel basket checklist</h3>
        <span className="checklist-total">{totalChecked} / {totalItems} checked</span>
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
                {sub.slots.map((slot) => {
                  if (slot.type === 'tier-group') {
                    const selected = selectedTier(slot.tiers);
                    const checked = selected !== null;
                    const activeItem = selected ?? slot.tiers[0];
                    return (
                      <div key={slot.label} className={`checklist-item ${checked ? 'checked' : ''}`}>
                        <label className="checklist-item-label">
                          <input type="checkbox" checked={checked} onChange={() => toggleTierGroup(slot.tiers)} />
                          <span>{slot.label}</span>
                        </label>
                        {checked && (
                          <div className="tier-controls">
                            <select
                              className="tier-select"
                              value={activeItem.id}
                              onChange={(e) => changeTier(slot.tiers, e.target.value)}
                            >
                              {slot.tiers.map((t) => (
                                <option key={t.id} value={t.id}>{getTierLabel(t)}</option>
                              ))}
                            </select>
                            <div className="qty-stepper">
                              <button type="button" onClick={() => setQuantity(activeItem.id, quantityOf(activeItem.id) - 1)}>−</button>
                              <span className="qty-stepper-value">
                                {quantityOf(activeItem.id)} {pluralizeUnit(getItemUnit(activeItem).unit, quantityOf(activeItem.id))}
                              </span>
                              <button type="button" onClick={() => setQuantity(activeItem.id, quantityOf(activeItem.id) + 1)}>+</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  const item = slot.item;
                  const checked = isChecked(item.id);
                  return (
                    <div key={item.id} className={`checklist-item ${checked ? 'checked' : ''}`}>
                      <label className="checklist-item-label">
                        <input type="checkbox" checked={checked} onChange={() => toggleItem(item)} />
                        <span>{item.name}</span>
                      </label>
                      {checked && item.pricing_model === 'unit' && (
                        <div className="qty-stepper">
                          <button type="button" onClick={() => setQuantity(item.id, quantityOf(item.id) - 1)}>−</button>
                          <span className="qty-stepper-value">
                            {quantityOf(item.id)} {pluralizeUnit(getItemUnit(item).unit, quantityOf(item.id))}
                          </span>
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
