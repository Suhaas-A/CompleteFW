import { useState } from "react";
import { sendResetOtp, resetPassword } from "../api/authApi";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const { dark } = useTheme();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSendOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await sendResetOtp(email);
      setMessage("If the email exists, an OTP has been sent.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await resetPassword(email, otp, newPassword);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 ${
        dark ? "bg-[#0F1012] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl border p-8 ${
          dark
            ? "bg-[#14161A] border-[#262626]"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm tracking-widest text-[#D4AF37] mb-2">
            ACCOUNT SECURITY
          </p>
          <h2 className="text-3xl font-extrabold">
            Forgot Password
          </h2>
          <p
            className={`mt-2 text-sm ${
              dark ? "text-[#A1A1AA]" : "text-gray-600"
            }`}
          >
            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && "Verify OTP and set a new password"}
            {step === 3 && "Password updated successfully"}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {message && step !== 3 && (
          <div className="mb-6 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#D4AF37]">
            {message}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition ${
                  dark
                    ? "bg-[#0F1012] border border-[#262626] focus:border-[#D4AF37]"
                    : "bg-white border border-gray-300 focus:border-[#D4AF37]"
                }`}
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] py-3 text-black font-semibold hover:brightness-110 transition disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">OTP</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit OTP"
                className={`w-full rounded-xl px-4 py-3 text-sm tracking-widest outline-none transition ${
                  dark
                    ? "bg-[#0F1012] border border-[#262626] focus:border-[#D4AF37]"
                    : "bg-white border border-gray-300 focus:border-[#D4AF37]"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition ${
                  dark
                    ? "bg-[#0F1012] border border-[#262626] focus:border-[#D4AF37]"
                    : "bg-white border border-gray-300 focus:border-[#D4AF37]"
                }`}
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] py-3 text-black font-semibold hover:brightness-110 transition disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="text-[#D4AF37] text-xl font-semibold">
              Password Updated 🎉
            </div>
            <p
              className={`text-sm ${
                dark ? "text-[#A1A1AA]" : "text-gray-600"
              }`}
            >
              You can now log in with your new password.
            </p>
            <Link
              to="/login"
              className="inline-block rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] px-8 py-3 text-black font-semibold hover:brightness-110 transition"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
