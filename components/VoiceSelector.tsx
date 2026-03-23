"use client";

import { voiceCategories, voiceOptions } from "@/lib/constants";
import { VoiceSelectorProps } from "@/types";

function VoiceSelector({ value, onChange, disabled, className }: Readonly<VoiceSelectorProps>) {
  const groups = [
    { label: "Male Voices", keys: voiceCategories.male },
    { label: "Female Voices", keys: voiceCategories.female },
  ];

  return (
    <div
      className={`space-y-5 ${className ?? ""}`}
      role="radiogroup"
      aria-label="Voice selector"
      aria-disabled={disabled}
    >
      {groups.map((group) => (
        <div key={group.label} className="space-y-3">
          <p className="text-sm font-semibold text-(--text-secondary)">{group.label}</p>

          <div className="voice-selector-options grid grid-cols-1 sm:grid-cols-3">
            {group.keys.map((key) => {
              const voice = voiceOptions[key as keyof typeof voiceOptions];
              const isSelected = value === key;

              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onChange(key)}
                  disabled={disabled}
                  className={`voice-selector-option ${
                    isSelected ? "voice-selector-option-selected" : "voice-selector-option-default"
                  } ${disabled ? "voice-selector-option-disabled" : ""}`}
                >
                  <div className="min-w-0 text-left">
                    <p className="font-semibold text-(--text-primary)">{voice.name}</p>
                    <p className="text-xs text-(--text-secondary) line-clamp-2">{voice.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VoiceSelector;
