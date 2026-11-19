'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { MenuItem, CategoryId } from '@/types';
import { useMenu } from '@/context/MenuContext';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  RotateCcw, 
  Check, 
  X, 
  Search, 
  Upload, 
  Sparkles,
  Tag,
  DollarSign,
  Coffee,
  AlertTriangle
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Cold Coffee', url: '/images/cold_coffee.jpg' },
  { label: 'Hazelnut Frappe', url: '/images/hazelnut_frappe.jpg' },
  { label: 'Spanish Latte', url: '/images/spanish_latte.jpg' },
  { label: 'Blueberry Shake', url: '/images/blueberry_shake.jpg' },
  { label: 'Margherita Pizza', url: '/images/margherita_pizza.jpg' },
  { label: 'Alfredo Pasta', url: '/images/alfredo_pasta.jpg' },
  { label: 'Peri-Peri Fries', url: '/images/peri_peri_fries.jpg' },
];

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'all', label: 'All Items' },
  { id: 'cold', label: '🧊 Signature Cold' },
  { id: 'hot', label: '☕ Hot Brews' },
  { id: 'shakes', label: '🥤 Thick Shakes' },
  { id: 'pizza', label: '🍕 Pizzas' },
  { id: 'pasta', label: '🍝 Pasta' },
  { id: 'bites', label: '🍟 Fast Food & Fries' },
];

export const BaristaMenuEditor: React.FC = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, resetMenuToDefault } = useMenu();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState<number>(149);
  const [formCategory, setFormCategory] = useState<CategoryId>('cold');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('/images/cold_coffee.jpg');
  const [formBadge, setFormBadge] = useState('');
  const [formIsVeg, setFormIsVeg] = useState(true);

  // Quick Inline Price Editing
  const [inlinePriceId, setInlinePriceId] = useState<string | null>(null);
  const [inlinePriceVal, setInlinePriceVal] = useState<number>(0);

  // Delete Confirmation Dialog
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormName('');
    setFormPrice(179);
    setFormCategory('cold');
    setFormDescription('Freshly prepared specialty drive-thru brew.');
    setFormImage('/images/cold_coffee.jpg');
    setFormBadge('');
    setFormIsVeg(true);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormPrice(item.price);
    setFormCategory(item.category);
    setFormDescription(item.description);
    setFormImage(item.image);
    setFormBadge(item.badge || '');
    setFormIsVeg(item.isVeg ?? true);
    setIsModalOpen(true);
  };

  // Handle Form Submit (Add or Update)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) return;

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name: formName.trim(),
        price: Number(formPrice),
        category: formCategory === 'all' ? 'cold' : formCategory,
        description: formDescription.trim(),
        image: formImage.trim() || '/images/cold_coffee.jpg',
        badge: formBadge.trim() || undefined,
        isVeg: formIsVeg,
      });
    } else {
      addMenuItem({
        name: formName.trim(),
        price: Number(formPrice),
        category: formCategory === 'all' ? 'cold' : formCategory,
        description: formDescription.trim(),
        image: formImage.trim() || '/images/cold_coffee.jpg',
        badge: formBadge.trim() || undefined,
        isVeg: formIsVeg,
      });
    }

    setIsModalOpen(false);
  };

  // Handle File Upload to Base64
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save quick inline price change
  const handleSaveInlinePrice = (id: string) => {
    if (inlinePriceVal > 0) {
      updateMenuItem(id, { price: inlinePriceVal });
    }
    setInlinePriceId(null);
  };

  // Filter items by category & search query
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-noir-card border border-concrete-300 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="min-w-0 w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <h1 className="text-base sm:text-xl font-black text-concrete-900 dark:text-white leading-tight">
              Menu Manager &amp; Live Price Editor
            </h1>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-brand-sky/15 text-brand-sky border border-brand-sky/30 whitespace-nowrap flex-shrink-0 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-sky animate-pulse flex-shrink-0"></span>
              REAL-TIME SYNC
            </span>
          </div>
          <p className="text-xs text-concrete-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
            Add items, edit titles, adjust live prices, or replace food photos. All updates sync instantly to customer phones.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto flex-shrink-0">
          <button
            onClick={resetMenuToDefault}
            className="px-3 sm:px-3.5 py-2 rounded-xl border border-concrete-300 dark:border-white/10 hover:border-concrete-400 text-concrete-700 dark:text-zinc-300 text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap flex-shrink-0"
            title="Reset menu to default signature items"
          >
            <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap flex-shrink-0"
            id="add-menu-item-button"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span>+ Add New Item</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex-shrink-0 transition border ${
                selectedCategory === cat.id
                  ? 'bg-brand-sky text-black border-brand-sky shadow-sm'
                  : 'bg-white dark:bg-noir-card text-concrete-700 dark:text-zinc-400 border-concrete-300 dark:border-white/10 hover:border-brand-sky'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-concrete-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card text-concrete-900 dark:text-white placeholder-concrete-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-sky"
          />
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="group rounded-3xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card overflow-hidden flex flex-col justify-between hover:border-brand-sky hover:shadow-lg transition-all"
          >
            {/* Food Image Container */}
            <div className="relative h-44 w-full bg-concrete-100 dark:bg-white/5 overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Badges */}
              {item.badge && (
                <span className="absolute top-2.5 left-2.5 bg-brand-sky text-black text-[10px] font-black px-2 py-0.5 rounded shadow whitespace-nowrap flex-shrink-0 inline-flex items-center">
                  {item.badge}
                </span>
              )}

              {item.isVeg && (
                <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 text-emerald-400 bg-black/70 backdrop-blur-md whitespace-nowrap flex-shrink-0 inline-flex items-center">
                  🌱 100% VEG
                </span>
              )}
            </div>

            {/* Item Info & Quick Edit */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-concrete-900 dark:text-white leading-snug">
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-concrete-100 dark:bg-white/5 text-concrete-600 dark:text-zinc-400 flex-shrink-0">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-concrete-600 dark:text-zinc-400 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Price & Actions Row */}
              <div className="pt-3 border-t border-concrete-200 dark:border-white/10 flex items-center justify-between gap-2">
                
                {/* Live Price with Quick Inline Edit */}
                <div>
                  <span className="text-[10px] font-bold text-concrete-500 dark:text-zinc-500 block">
                    PRICE (₹)
                  </span>

                  {inlinePriceId === item.id ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <input
                        type="number"
                        value={inlinePriceVal}
                        onChange={e => setInlinePriceVal(Number(e.target.value))}
                        className="w-16 px-1.5 py-0.5 text-xs font-mono font-bold rounded border border-brand-sky bg-white dark:bg-noir-surface text-concrete-900 dark:text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveInlinePrice(item.id)}
                        className="p-1 rounded bg-emerald-500 text-black hover:bg-emerald-400"
                        title="Save Price"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setInlinePriceId(null)}
                        className="p-1 rounded bg-concrete-200 dark:bg-white/10 text-concrete-700 dark:text-zinc-300"
                        title="Cancel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => {
                        setInlinePriceId(item.id);
                        setInlinePriceVal(item.price);
                      }}
                      className="cursor-pointer group/price flex items-center gap-1"
                      title="Click to quickly edit price"
                    >
                      <span className="text-base font-black font-mono text-concrete-900 dark:text-white">
                        ₹{item.price}
                      </span>
                      <Edit3 className="w-3 h-3 text-concrete-400 opacity-0 group-hover/price:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>

                {/* Edit & Delete Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl border border-concrete-300 dark:border-white/10 hover:border-brand-sky text-concrete-700 dark:text-zinc-300 hover:text-brand-sky text-xs font-bold transition"
                    title="Edit Item Details"
                    aria-label={`Edit ${item.name}`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setItemToDelete(item)}
                    className="p-2 rounded-xl border border-concrete-300 dark:border-white/10 hover:border-red-400 text-concrete-700 dark:text-zinc-300 hover:text-red-400 text-xs font-bold transition"
                    title="Delete Item"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ======================================================== */}
      {/* ADD / EDIT MODAL                                         */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="max-w-xl w-full max-h-[92vh] overflow-y-auto rounded-3xl border p-5 sm:p-7 relative bg-white dark:bg-noir-surface border-concrete-300 dark:border-white/10 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-concrete-200 dark:border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">☕</span>
                <div>
                  <h3 className="font-bold text-base text-concrete-900 dark:text-white">
                    {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                  </h3>
                  <p className="text-[11px] text-concrete-500 dark:text-zinc-400">
                    Updates will sync in real time across the website
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-concrete-400 hover:text-concrete-900 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              
              {/* Item Name */}
              <div>
                <label className="block font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                  Item Title / Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Spanish Condensed Milk Latte"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky"
                />
              </div>

              {/* Price & Category in 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="179"
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as CategoryId)}
                    className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky"
                  >
                    <option value="cold">Signature Cold Coffees</option>
                    <option value="hot">Hot Brews</option>
                    <option value="shakes">Thick Shakes</option>
                    <option value="pizza">Handcrafted Pizzas</option>
                    <option value="pasta">Pasta</option>
                    <option value="bites">Fast Food &amp; Fries</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Appetizing description of ingredients, texture, flavor profile..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky resize-none"
                />
              </div>

              {/* Image Input Section */}
              <div className="p-3.5 rounded-2xl bg-concrete-50 dark:bg-noir-card border border-concrete-200 dark:border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-concrete-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-brand-sky" />
                    <span>Food Image URL or Upload</span>
                  </label>
                  
                  {/* File Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg border border-concrete-300 dark:border-white/10 hover:border-brand-sky bg-white dark:bg-noir-surface text-[11px] font-bold text-brand-sky flex items-center gap-1 transition"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Direct URL input */}
                <input
                  type="text"
                  placeholder="/images/cold_coffee.jpg or https://..."
                  value={formImage}
                  onChange={e => setFormImage(e.target.value)}
                  className="w-full bg-white dark:bg-noir-surface border border-concrete-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky font-mono"
                />

                {/* Preset image pills */}
                <div>
                  <span className="text-[10px] text-concrete-500 dark:text-zinc-400 block mb-1">
                    Or select from Grey Dot food photography presets:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormImage(preset.url)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition border whitespace-nowrap flex-shrink-0 ${
                          formImage === preset.url
                            ? 'bg-brand-sky text-black border-brand-sky font-bold'
                            : 'bg-white dark:bg-noir-surface text-concrete-600 dark:text-zinc-400 border-concrete-200 dark:border-white/5'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Image Thumbnail Preview */}
                {formImage && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-concrete-300 dark:border-white/10 flex-shrink-0 bg-concrete-200 dark:bg-white/5">
                      <Image
                        src={formImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                        onError={() => {}}
                      />
                    </div>
                    <div className="text-[11px] text-concrete-500 dark:text-zinc-400 leading-tight">
                      <span className="font-bold text-concrete-700 dark:text-zinc-300 block">Preview Loaded</span>
                      <span>This image will display on customer menu cards</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Promotional Badge & Vegetarian Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                    Promotional Badge (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BESTSELLER / SIGNATURE"
                    value={formBadge}
                    onChange={e => setFormBadge(e.target.value.toUpperCase())}
                    className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky uppercase"
                  />
                </div>

                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-concrete-300 dark:border-white/10 bg-concrete-50 dark:bg-noir-card w-full">
                    <input
                      type="checkbox"
                      checked={formIsVeg}
                      onChange={e => setFormIsVeg(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-sky focus:ring-brand-sky"
                    />
                    <span className="font-bold text-xs text-concrete-800 dark:text-zinc-200">
                      🌱 100% Vegetarian
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Action CTA */}
              <div className="pt-3 border-t border-concrete-200 dark:border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-concrete-300 dark:border-white/10 text-concrete-700 dark:text-zinc-300 font-bold hover:bg-concrete-100 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black font-bold shadow-md transition flex items-center gap-1.5 active:scale-95"
                  id="save-menu-item-button"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingItem ? 'Save & Sync Updates' : 'Add to Menu'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION DIALOG                               */}
      {/* ======================================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-sm w-full rounded-3xl border p-6 bg-white dark:bg-noir-surface border-concrete-300 dark:border-white/10 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center text-xl mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-concrete-900 dark:text-white">
                Delete &ldquo;{itemToDelete.name}&rdquo;?
              </h3>
              <p className="text-xs text-concrete-600 dark:text-zinc-400 mt-1">
                This item will be removed immediately from the drive-thru menu.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-concrete-300 dark:border-white/10 text-concrete-700 dark:text-zinc-300 font-bold text-xs"
              >
                Keep Item
              </button>
              <button
                onClick={() => {
                  deleteMenuItem(itemToDelete.id);
                  setItemToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
