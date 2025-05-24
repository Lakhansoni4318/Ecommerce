import { useState, useEffect } from "react";
import apiService from "../../api/apiService";
import { toast } from 'react-toastify';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  accountType?: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    accountType: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<UserProfile>(profile);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const loadedProfile: UserProfile = {
          name: userData.username || "",
          email: userData.email || "",
          accountType: userData.accountType || "",
          phone: userData.phone ||"",
          address: userData.address ||"",
        };
        setProfile(loadedProfile);
        setForm(loadedProfile);
      } catch (e) {
        console.error("Failed to parse user profile from localStorage", e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


const saveProfile = () => {
  setProfile(form);
  setEditMode(false);

  const savedProfile = {
    username: form.name,
    email: form.email,
    accountType: form.accountType,
    phone: form.phone,
    address: form.address,
  };

  apiService.updateProfile(savedProfile)
    .then(() => {
      toast.success("Profile updated successfully");
      localStorage.setItem("user", JSON.stringify(savedProfile));
    })
    .catch((error) => {
      toast.error("Failed to update profile");
      console.error("Failed to update profile:", error);
    });
};

  const cancelEdit = () => {
    setForm(profile);
    setEditMode(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{profile.name || "No Name"}</h1>
        <p className="text-gray-600">{profile.email || "No Email"}</p>
        <p className="text-sm text-gray-500">Account Type: {profile.accountType || "-"}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>

        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="(optional)"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Address</label>
              <textarea
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                placeholder="(optional)"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={saveProfile}
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <strong>Name:</strong> {profile.name}
            </div>
            <div>
              <strong>Email:</strong> {profile.email}
            </div>
            {profile.phone && (
              <div>
                <strong>Phone:</strong> {profile.phone}
              </div>
            )}
            {profile.address && (
              <div>
                <strong>Address:</strong> {profile.address}
              </div>
            )}
            <button
              onClick={() => setEditMode(true)}
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
