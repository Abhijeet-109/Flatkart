import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { useAddressBook } from '../../context/AddressContext';
import { useAuth } from '../../context/AuthContext';
import { accountService } from '../../services/accountService';

export function DeliveryModal({ isOpen, onClose, onNavigate }) {
  const { addresses, selectedAddress, selectAddress, setDefaultAddress, refreshAddresses } = useAddressBook();
  const { isAuthenticated } = useAuth();
  const [pin, setPin] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

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
        style={{ maxWidth: 540, width: '92vw' }}
      >
        <div className="fk-auth-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--fk-forest-dark)" />
            <strong>Choose delivery location</strong>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: 20 }}>
          {isAuthenticated ? (
            <>
              {addresses.length ? (
                addresses.map((address) => (
                  <article
                    key={address.id}
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                      padding: 12,
                      borderBottom: '1px solid #e7e5dc',
                      cursor: 'pointer',
                    }}
                    onClick={() => selectAddress(address.id)}
                  >
                    <input
                      type="radio"
                      name="delivery-address"
                      checked={selectedAddress?.id === address.id}
                      onChange={() => selectAddress(address.id)}
                      aria-label={`Deliver to ${address.label} ${address.pin_code}`}
                      style={{ marginTop: '3px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong>{address.label}{address.is_default ? ' · Default' : ''}</strong>
                      <p style={{ margin: '5px 0', fontSize: '13px', lineHeight: 1.45, color: 'var(--fk-text-muted)' }}>
                        {[address.recipient_name, address.address_line1, address.address_line2, address.locality, address.city, address.state, address.pin_code].filter(Boolean).join(', ')}
                      </p>
                      {!address.is_default && (
                        <button
                          type="button"
                          className="fk-checkout-back"
                          style={{ fontSize: '12px', marginTop: '4px' }}
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
                ))
              ) : (
                <p style={{ color: 'var(--fk-text-muted)', fontSize: '14px' }}>No saved addresses yet.</p>
              )}
              <div style={{ display: 'flex', gap: '10px', marginTop: 14 }}>
                <button
                  type="button"
                  className="fk-auth-btn"
                  style={{ flex: 1 }}
                  onClick={() => {
                    onClose();
                    onNavigate?.('account', 'address');
                  }}
                >
                  {addresses.length ? 'Manage addresses' : 'Add an address'}
                </button>
                <button type="button" className="fk-checkout-back" onClick={refreshAddresses}>
                  Refresh
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={checkPin}>
              <label htmlFor="fk-nav-pincode" style={{ fontSize: '14px', fontWeight: '600' }}>
                Check delivery availability by PIN code
              </label>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <input
                  id="fk-nav-pincode"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={pin}
                  onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  style={{ flex: 1, padding: '10px 12px', border: '1px solid #d6d7ce', borderRadius: '4px', font: 'inherit' }}
                />
                <button
                  type="submit"
                  disabled={busy}
                  style={{
                    backgroundColor: 'var(--fk-forest-dark)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0 16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {busy ? 'Checking…' : 'Check'}
                </button>
              </div>
            </form>
          )}
          {feedback && (
            <p role="status" style={{ marginTop: 12, marginBottom: 0, fontSize: '13px', color: feedback.startsWith('Deliverable') ? 'var(--fk-forest-dark)' : '#b91c1c' }}>
              {feedback}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default DeliveryModal;
