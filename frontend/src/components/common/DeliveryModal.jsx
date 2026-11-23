import React, { useState } from 'react';
import { X, MapPin, RotateCw, CheckCircle2 } from 'lucide-react';
import { useAddressBook } from '../../context/AddressContext';
import { useAuth } from '../../context/AuthContext';
import { accountService } from '../../services/accountService';

export function DeliveryModal({ isOpen, onClose, onNavigate }) {
  const { addresses, selectedAddress, selectAddress, setDefaultAddress, refreshAddresses } = useAddressBook();
  const { isAuthenticated } = useAuth();
  const [pin, setPin] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (refreshAddresses) await refreshAddresses();
      setFeedback('Addresses updated.');
    } catch {
      setFeedback('Could not refresh addresses.');
    } finally {
      setTimeout(() => setRefreshing(false), 400);
    }
  };

  const checkPin = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(pin)) {
      setFeedback('Enter a valid six-digit PIN code.');
      return;
    }
    setBusy(true);
    setFeedback('Checking delivery availability…');
    try {
      const result = await accountService.deliveryCheck(pin);
      setFeedback(result.deliverable ? `Deliverable: ${result.area}, ${result.city}` : 'Delivery is unavailable at this PIN code.');
    } catch (error) {
      setFeedback(error.message || 'Could not check this PIN code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fk-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="fk-auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Delivery location"
        onClick={(event) => event.stopPropagation()}
        style={{ maxWidth: 520, width: '92vw', borderRadius: 16 }}
      >
        <div className="fk-auth-header" style={{ padding: '16px 20px', borderBottom: '1px solid #EFECE4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="var(--fk-header, #122D29)" />
            <strong style={{ fontSize: '16px', color: 'var(--fk-header, #122D29)' }}>Choose delivery location</strong>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--fk-text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {isAuthenticated ? (
            <>
              {addresses.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '340px', overflowY: 'auto' }}>
                  {addresses.map((address) => {
                    const isSelected = selectedAddress?.id === address.id;
                    return (
                      <article
                        key={address.id}
                        style={{
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                          padding: '12px 14px',
                          border: isSelected ? '1.5px solid var(--fk-header, #122D29)' : '1px solid #E5E0D5',
                          borderRadius: 10,
                          backgroundColor: isSelected ? 'rgba(18, 45, 41, 0.03)' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'border-color 0.15s, background-color 0.15s',
                        }}
                        onClick={() => selectAddress(address.id)}
                      >
                        <input
                          type="radio"
                          name="delivery-address"
                          checked={isSelected}
                          onChange={() => selectAddress(address.id)}
                          aria-label={`Deliver to ${address.label} ${address.pin_code}`}
                          style={{ marginTop: 3, accentColor: 'var(--fk-header, #122D29)', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: '14px', color: 'var(--fk-text-primary, #1F2937)' }}>
                              {address.label}
                            </strong>
                            {address.is_default && (
                              <span style={{ fontSize: '11px', background: '#EAE6DC', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                                Default
                              </span>
                            )}
                          </div>
                          <p style={{ margin: '5px 0 0', fontSize: '13px', lineHeight: 1.45, color: 'var(--fk-text-muted)' }}>
                            {[address.recipient_name, address.address_line1, address.address_line2, address.locality, address.city, address.state, address.pin_code].filter(Boolean).join(', ')}
                          </p>
                          {!address.is_default && (
                            <button
                              type="button"
                              className="fk-checkout-back"
                              style={{ fontSize: '12px', marginTop: 6, padding: 0, textDecoration: 'underline' }}
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await setDefaultAddress(address.id);
                                  setFeedback('Default address changed.');
                                } catch (error) {
                                  setFeedback(error.message || 'Could not set default address.');
                                }
                              }}
                            >
                              Set as default
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--fk-text-muted)', fontSize: '14px', margin: '8px 0' }}>No saved addresses yet.</p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                <button
                  type="button"
                  className="fk-auth-btn"
                  style={{ flex: 1, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => {
                    onClose();
                    onNavigate?.('account', 'address');
                  }}
                >
                  {addresses.length ? 'Manage addresses' : 'Add an address'}
                </button>
                <button
                  type="button"
                  title="Refresh address list"
                  aria-label="Refresh address list"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 42,
                    height: 42,
                    borderRadius: 8,
                    border: '1px solid #D8D4C8',
                    backgroundColor: '#FFFFFF',
                    cursor: refreshing ? 'not-allowed' : 'pointer',
                    color: 'var(--fk-header, #122D29)',
                    flexShrink: 0,
                  }}
                >
                  <RotateCw size={17} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={checkPin}>
              <label htmlFor="fk-nav-pincode" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--fk-text-primary)' }}>
                Check delivery availability by PIN code
              </label>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input
                  id="fk-nav-pincode"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={pin}
                  onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  style={{ flex: 1, padding: '10px 12px', border: '1px solid #D8D4C8', borderRadius: 8, font: 'inherit' }}
                />
                <button
                  type="submit"
                  disabled={busy}
                  style={{
                    backgroundColor: 'var(--fk-header, #122D29)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0 18px',
                    fontWeight: '600',
                    cursor: busy ? 'not-allowed' : 'pointer',
                  }}
                >
                  {busy ? 'Checking…' : 'Check'}
                </button>
              </div>
            </form>
          )}

          {feedback && (
            <p
              role="status"
              style={{
                marginTop: 14,
                marginBottom: 0,
                fontSize: '13px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: feedback.startsWith('Deliverable') || feedback.includes('updated') || feedback.includes('changed')
                  ? 'var(--fk-header, #122D29)'
                  : '#B91C1C',
              }}
            >
              {(feedback.startsWith('Deliverable') || feedback.includes('updated') || feedback.includes('changed')) && (
                <CheckCircle2 size={16} />
              )}
              {feedback}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default DeliveryModal;
