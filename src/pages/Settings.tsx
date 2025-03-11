import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
});

type ProfileSchema = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(6).optional(),
  newPassword: z.string().min(6).optional(),
  confirmPassword: z.string().min(6).optional(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

type PasswordSchema = z.infer<typeof passwordSchema>;

export default function Settings() {
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
  });

  const {
  
  
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
  });

  const handleProfileUpdate = (data: ProfileSchema) => {
    console.log('Profile data', data);
    // TODO: Implement profile update logic
  };


  const handlePasswordChange = (data: PasswordSchema) => {
    console.log('Password data', data);
    // TODO: Implement password change logic
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
      <p className="mt-4 text-gray-600">
        Manage your account settings and preferences.
      </p>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          User Profile
        </h2>
        <form onSubmit={handleSubmitProfile(handleProfileUpdate)} className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                {...registerProfile('firstName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {profileErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">{profileErrors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                {...registerProfile('lastName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {profileErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">{profileErrors.lastName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...registerProfile('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {profileErrors.email && (
                <p className="text-red-500 text-xs mt-1">{profileErrors.email.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Profile
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Change Password
        </h2>
        <form onSubmit={handleSubmitPassword(handlePasswordChange)} className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                {...registerPassword('currentPassword')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                {...registerPassword('newPassword')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...registerPassword('confirmPassword')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Change Password
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Notification Preferences
        </h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <label htmlFor="emailNotifications" className="block text-sm font-medium text-gray-700">
              Email Notifications
            </label>
            <input
              type="checkbox"
              id="emailNotifications"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <label htmlFor="smsNotifications" className="block text-sm font-medium text-gray-700">
              SMS Notifications
            </label>
            <input
              type="checkbox"
              id="smsNotifications"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Recent Activity
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">2025-03-11</td>
                <td className="px-6 py-4 whitespace-nowrap">Updated profile information</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">2025-03-10</td>
                <td className="px-6 py-4 whitespace-nowrap">Changed password</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">2025-03-09</td>
                <td className="px-6 py-4 whitespace-nowrap">Subscribed to HS Code 123456</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
