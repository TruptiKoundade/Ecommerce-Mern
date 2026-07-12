import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Message from '../components/Message';

const Profile = () => {
  const { user, updateUserInfo } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || '',
    phone: user?.address?.phone || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setSaving(true);
      const payload = {
        name: form.name,
        email: form.email,
        address: {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
          phone: form.phone,
        },
      };
      if (form.password) payload.password = form.password;

      const { data } = await api.put('/auth/profile', payload);
      updateUserInfo(data);
      setSuccess('Profile updated successfully!');
      setForm({ ...form, password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      {error && <div className="mb-4"><Message type="error">{error}</Message></div>}
      {success && <div className="mb-4"><Message type="success">{success}</Message></div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
        </div>

        <hr />
        <p className="text-sm font-semibold text-gray-700">Default Shipping Address</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input name="city" value={form.city} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input name="postalCode" value={form.postalCode} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input name="country" value={form.country} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-medium px-6 py-2.5 rounded-md"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
