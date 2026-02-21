import { FormControl, FormLabel, Box, Checkbox } from "@hope-ui/solid";
import { createEffect, createSignal } from "solid-js";
import { Locale } from "@locale";
import { assertValueDefined, getKey, setKey } from "@utils";
import { Config, NOOP } from "@config/config-def";

declare module "@config/config-def" {
  interface Config {
    hk4eEnableSteamStub: boolean;
  }
}

const CONFIG_KEY = "config_hk4e_enable_steam_stub";

export async function createEnableSteamStub({
  locale,
  config,
}: {
  config: Partial<Config>;
  locale: Locale;
}) {
  try {
    config.hk4eEnableSteamStub = (await getKey(CONFIG_KEY)) == "true";
  } catch {
    config.hk4eEnableSteamStub = false;
  }

  const [value, setValue] = createSignal(config.hk4eEnableSteamStub);

  async function onSave(apply: boolean) {
    assertValueDefined(config.hk4eEnableSteamStub);
    if (!apply) {
      setValue(config.hk4eEnableSteamStub);
      return NOOP;
    }
    if (config.hk4eEnableSteamStub == value()) return NOOP;
    config.hk4eEnableSteamStub = value();
    await setKey(CONFIG_KEY, config.hk4eEnableSteamStub ? "true" : "false");
    return NOOP;
  }

  createEffect(() => {
    value();
    onSave(true);
  });

  return [
    function UI() {
      return (
        <FormControl id="hk4eEnableSteamStub">
          <FormLabel>{locale.get("SETTING_STEAM_STUB")}</FormLabel>
          <Box>
            <Checkbox
              checked={value()}
              onChange={() => setValue(x => !x)}
              size="md"
            >
              {locale.get("SETTING_ENABLED")}
            </Checkbox>
          </Box>
        </FormControl>
      );
    },
  ] as const;
}
