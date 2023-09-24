import presetTypography from "@twind/preset-typography";
import presetForms from "@twind/preset-tailwind-forms";
import presetTailwind from "@twind/preset-tailwind";
import presetExt from "@twind/preset-ext";
import presetLineClamp from "@twind/preset-line-clamp";
import presetAutoprefix from "@twind/preset-autoprefix";
import type { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    fontFamily: {
      sans: ["Inter", "Helvetica", "sans-serif"],
    },
  },
  presets: [
    presetAutoprefix(),
    presetTailwind(),
    presetTypography(),
    presetLineClamp(),
    presetForms(),
    presetExt(),
  ],
} as Options;
