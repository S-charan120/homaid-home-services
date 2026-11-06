import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const [services, setServices] = React.useState([]);
  const [serviceId, setServiceId] = React.useState('cleaning');
  const [form, setForm] = React.useState({ customerName: '', customerEmail: '', address: '', scheduledAt: '', notes: '' });
  const [booking, setBooking] = React.useState(null);
  const [status, setStatus] = React.useState('Loading services…');
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { fetch('/api/services').then(r => { if (!r.ok) throw new Error('Service catalogue unavailable'); return r.json(); }).then(x => { setServices(x.items); if (x.items[0]) setServiceId(x.items[0].id); setStatus(''); }).catch(() => setStatus('We could not load services. Check that the API is running.')); }, []);
  const change = e => setForm(v => ({ ...v, [e.target.name]: e.target.value }));
  async function submit(e) {
    e.preventDefault(); setBusy(true); setBooking(null); setStatus('Submitting booking…');
    try {
      const response = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() }, body: JSON.stringify({ ...form, serviceId, scheduledAt: new Date(form.scheduledAt).toISOString() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details?.join(', ') || data.error || 'Booking failed');
      setBooking(data); setStatus('Your request has been recorded. Save the booking ID and access token to view it later.');
      setForm({ customerName: '', customerEmail: '', address: '', scheduledAt: '', notes: '' });
    } catch (error) { setStatus(error.message || 'Unable to submit booking.'); }
    finally { setBusy(false); }
  }
  return <main>
    <nav><a className="brand" href="#top">homaid<span>.</span></a><span>Home services, thoughtfully arranged</span><a className="nav-link" href="#services">Explore services</a></nav>
    <section className="hero" id="top"><div><p className="eyebrow">A LITTLE HELP GOES A LONG WAY</p><h1>Home care,<br/><em>made simpler.</em></h1><p className="lead">Book everyday home services with a clear request, a preferred time, and a little less hassle.</p><a className="primary-link" href="#booking">Book a service <span>↗</span></a><div className="proof"><span>● Clear booking requests</span><span>● Simple status tracking</span></div></div><div className="hero-card"><div className="sun">✳</div><div className="home-shape">⌂</div><p>Make room for<br/><b>the good things.</b></p></div></section>
    <section id="services" className="section"><div className="section-head"><div><p className="eyebrow">WHAT NEEDS DOING?</p><h2>Services for your space</h2></div><p>Choose a category to start a request.</p></div><div className="cards">{services.map((s, i) => <button type="button" className={'service-card ' + (serviceId === s.id ? 'active' : '')} key={s.id} onClick={() => setServiceId(s.id)}><span className="service-number">0{i + 1}</span><span className="service-icon">{['✳', '⌁', 'ϟ', '◌'][i % 4]}</span><h3>{s.name}</h3><p>{s.description}</p><b>Indicative ₹{s.indicativePriceINR}</b></button>)}</div>{status && !booking && <p className="notice" role="status">{status}</p>}</section>
    <section id="booking" className="booking-section"><div><p className="eyebrow">PLAN A VISIT</p><h2>Tell us what<br/>your home needs.</h2><p>Send a booking request with your contact details and preferred time. The request starts in a pending state.</p><div className="note">A submitted request is not a confirmed appointment. A service team must confirm it.</div></div><form className="booking-form" onSubmit={submit}><h3>Request a service</h3><label>Service<select value={serviceId} onChange={e => setServiceId(e.target.value)} required>{services.map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label><label>Your name<input name="customerName" value={form.customerName} onChange={change} minLength="2" maxLength="100" required autoComplete="name"/></label><label>Email address<input name="customerEmail" type="email" value={form.customerEmail} onChange={change} required autoComplete="email"/></label><label>Service address<textarea name="address" value={form.address} onChange={change} minLength="8" maxLength="500" required autoComplete="street-address" rows="2"/></label><label>Preferred date and time<input name="scheduledAt" type="datetime-local" value={form.scheduledAt} onChange={change} required/></label><label>Notes (optional)<textarea name="notes" value={form.notes} onChange={change} maxLength="1000" rows="2"/></label><button className="submit" disabled={busy || services.length === 0}>{busy ? 'Submitting…' : 'Send booking request ↗'}</button><p className="form-status" role="status">{status}</p>{booking && <div className="receipt"><b>Booking reference</b><code>{booking.bookingId}</code><b>Private access token — save it now</b><code>{booking.accessToken}</code><small>This token is shown once and is required to retrieve this booking.</small></div>}</form></section>
    <footer><b>homaid.</b><span>Home services booking platform · Portfolio project</span></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
