"use client";

import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  FileCheck2,
  Ship,
  Plane,
  Truck,
  Car,
  CreditCard,
  Building2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export function CostEstimatorForm() {
  const serviceTabs = [
    { id: "all-in-one", label: "واردات صفر تا صد", icon: Building2 },
    { id: "clearance", label: "ترخیص گمرکی", icon: FileCheck2 },
    { id: "automotive", label: "واردات خودرو و قطعات", icon: Car },
    { id: "shipping", label: "حمل بین‌المللی", icon: Ship },
    { id: "currency", label: "حواله ارزی", icon: CreditCard },
  ];

  const [activeTab, setActiveTab] = useState("all-in-one");
  const [formData, setFormData] = useState({
    origin: "china",
    shippingType: "sea",
    goodsDescription: "",
    weightOrVolume: "",
    hsCode: "",
    fullName: "",
    phone: "",
    company: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const origins = [
    { id: "china", label: "چین (گوانجو، شنژن، شانگهای، ایوو)" },
    { id: "uae", label: "امارات متحده عربی (دبی، جبل‌علی)" },
    { id: "turkey", label: "ترکیه (استانبول، مرسین)" },
    { id: "europe", label: "آلمان و کشورهای اروپایی" },
    { id: "other", label: "سایر مبادی تجاری" },
  ];

  const shippingTypes = [
    { id: "sea", label: "دریایی کانتینری (FCL / LCL)", time: "۱۸ الی ۲۵ روز", icon: Ship },
    { id: "air", label: "هوایی اکسپرس کارگو", time: "۳ الی ۵ روز", icon: Plane },
    { id: "land", label: "زمینی ترانزیت جاده‌ای (TIR)", time: "۱۰ الی ۱۶ روز", icon: Truck },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.fullName.trim()) {
      setErrorMessage("لطفاً نام و نام خانوادگی خود را وارد نمایید.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMessage("لطفاً یک شماره تماس معتبر (مانند ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.");
      return;
    }
    if (!formData.goodsDescription.trim()) {
      setErrorMessage("لطفاً شرح یا نوع کالا/قطعه را مشخص فرمایید.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const randomCode = `AK-${Math.floor(100000 + Math.random() * 900000)}`;
      setTrackingCode(randomCode);
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      origin: "china",
      shippingType: "sea",
      goodsDescription: "",
      weightOrVolume: "",
      hsCode: "",
      fullName: "",
      phone: "",
      company: "",
      notes: "",
    });
  };

  return (
    <section id="estimator" className="relative w-full py-24 sm:py-32 bg-zinc-50/50" dir="rtl">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight">
            استعلام آنلاین هزینه حمل، واردات و ترخیص
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
            مشخصات محموله خود را ثبت کنید تا کارشناسان ما ظرف کمتر از ۲ ساعت، برآورد اولیه بهای تمام‌شده و زمان‌بندی دقیق را به همراه Cost Sheet تفصیلی ارسال نمایند.
          </p>
        </div>

        {/* Specification Card (NO borders, soft floating shadow) */}
        <div className="bg-white rounded-3xl shadow-[0_12px_45px_rgba(15,21,48,0.03)] overflow-hidden">
          
          {/* Service Selector Tabs Bar (NO borders) */}
          <div className="bg-zinc-50/70 p-3 sm:p-4 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {serviceTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-zinc-950 text-white shadow-sm"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content or Submitted State */}
          <div className="p-7 sm:p-11">
            {submitted ? (
              <div className="max-w-xl mx-auto py-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                  <CheckCircle2 className="w-8 h-8" strokeWidth={2} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-zinc-950">
                    استعلام شما با موفقیت ثبت گردید
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    کارشناسان تخصصی بازرگانی جهان‌گستر اطلاعات محموله شما را بررسی کرده و حداکثر تا ۲ ساعت کاری آینده برای ارائه برآورد نهایی بهای تمام‌شده با شما تماس خواهند گرفت.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 font-mono text-sm inline-block shadow-2xs">
                  <span className="text-zinc-500 ml-2">کد پیگیری پرونده:</span>
                  <span className="font-bold text-zinc-950 text-base">{trackingCode}</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    ثبت استعلام جدید
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Section 1: Logistics Specs */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 pb-1">
                    <span>{"// STEP A: LOGISTICS PARAMETERS"}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Country of Origin */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-800">
                        کشور و بندر مبدأ:
                      </label>
                      <select
                        value={formData.origin}
                        onChange={(e) =>
                          setFormData({ ...formData, origin: e.target.value })
                        }
                        className="w-full p-3.5 rounded-xl bg-zinc-100/70 border-none text-xs text-zinc-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-950 font-sans shadow-2xs"
                      >
                        {origins.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Shipping Type */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-800">
                        روش حمل ترجیحی:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {shippingTypes.map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, shippingType: st.id })
                            }
                            className={`p-3 rounded-xl text-center transition-all cursor-pointer ${
                              formData.shippingType === st.id
                                ? "bg-zinc-950 text-white shadow-sm"
                                : "bg-zinc-100/70 hover:bg-zinc-200/60 text-zinc-700 shadow-2xs"
                            }`}
                          >
                            <div className="text-[11px] font-bold line-clamp-1">
                              {st.label.split(" (")[0]}
                            </div>
                            <div className="text-[10px] opacity-70 mt-0.5 font-mono">
                              {st.time}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Cargo Specifications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 pb-1">
                    <span>{"// STEP B: COMMODITY DETAILS"}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-zinc-800">
                        شرح یا نام تجاری کالا / قطعه / خودرو: *
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: قطعات یدکی خودرو، لوازم جانبی، کشنده اروپایی، مواد اولیه..."
                        value={formData.goodsDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            goodsDescription: e.target.value,
                          })
                        }
                        className="w-full p-3.5 rounded-xl bg-zinc-100/70 border-none text-xs text-zinc-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-950 font-sans shadow-2xs"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-800">
                        وزن یا حجم تقریبی (کیلوگرم / CBM):
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: ۵۰۰ کیلوگرم یا ۲ کانتینر ۴۰ فوت"
                        value={formData.weightOrVolume}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            weightOrVolume: e.target.value,
                          })
                        }
                        className="w-full p-3.5 rounded-xl bg-zinc-100/70 border-none text-xs text-zinc-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-950 font-sans shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Contact & Notes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 pb-1">
                    <span>{"// STEP C: CLIENT INFORMATION"}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-800">
                        نام و نام خانوادگی: *
                      </label>
                      <input
                        type="text"
                        placeholder="نام شما"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full p-3.5 rounded-xl bg-zinc-100/70 border-none text-xs text-zinc-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-950 shadow-2xs"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-800">
                        شماره تماس همراه (جهت هماهنگی): *
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        placeholder="09120000000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full p-3.5 rounded-xl bg-zinc-100/70 border-none text-xs text-zinc-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-950 font-mono text-left shadow-2xs"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-800">
                        شرکت / نام تجاری (اختیاری):
                      </label>
                      <input
                        type="text"
                        placeholder="نام شرکت بازرگانی یا تولیدی"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="w-full p-3.5 rounded-xl bg-zinc-100/70 border-none text-xs text-zinc-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-950 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-800">
                      توضیحات تکمیلی یا شرایط خاص محموله:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="اگر نیاز به ترخیص از گمرک خاصی دارید، یا سوالی در خصوص مجوز استاندارد دارید، اینجا یادداشت کنید..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full p-3.5 rounded-xl bg-zinc-100/70 border-none text-xs text-zinc-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-950 resize-none shadow-2xs"
                    />
                  </div>
                </div>

                {/* Form Action Footer */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>اطلاعات تجاری شما نزد گروه بازرگانی جهان‌گستر ۱۰۰٪ محرمانه خواهد بود.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all duration-150 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <span>در حال ثبت استعلام...</span>
                    ) : (
                      <>
                        <span>ارسال و دریافت استعلام قیمت</span>
                        <Send className="w-4 h-4" strokeWidth={1.75} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

export default CostEstimatorForm;
