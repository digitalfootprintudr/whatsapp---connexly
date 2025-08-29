'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { getMenuForRole, MenuItem } from '../lib/menu-config';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  if (!session) return null;

  const userRole = (session as any)?.role as string;
  const menuItems = getMenuForRole(userRole);

  if (!menuItems.length) return null;

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const active = isActive(item.href);

    return (
      <div key={item.id} className="space-y-1">
        <div className="relative">
          <Link
            href={item.href}
            className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              active
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            } ${level > 0 ? 'ml-4' : ''}`}
            onClick={() => {
              if (!hasChildren) {
                setIsMobileMenuOpen(false);
              }
            }}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </div>
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleExpanded(item.id);
                }}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </button>
            )}
          </Link>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-gray-900 bg-opacity-75">
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-xl">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="px-4 py-6 space-y-2">
              {menuItems.map((item) => renderMenuItem(item))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 lg:bg-gray-800 lg:border-r lg:border-gray-700">
        <div className="flex items-center h-16 px-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Navigation</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>

      {/* Main content margin for desktop */}
      <div className="hidden lg:block lg:ml-64" />
    </>
  );
}
