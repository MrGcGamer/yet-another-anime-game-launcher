import {
  createIcon,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
} from "@hope-ui/solid";
import { createEffect, createSignal } from "solid-js";
import { Locale } from "../locale";
import { Config, NOOP } from "./config-def";
import { assertValueDefined, getKey, setKey } from "@utils";

declare module "./config-def" {
  interface Config {
    customENVs: string;
  }
}

const CONFIG_KEY = "config_customENVs";

export async function createCustomEnv({
  config,
  locale,
}: {
  config: Partial<Config>;
  locale: Locale;
}) {
  try {
    config.customENVs = await getKey(CONFIG_KEY);
  } catch {
    config.customENVs = "";
  }

  const [value, setValue] = createSignal(config.customENVs);

  async function onSave(apply: boolean) {
    assertValueDefined(config.customENVs);
    if (!apply) {
      setValue(config.customENVs);
      return NOOP;
    }
    if (config.customENVs == value()) return NOOP;
    config.customENVs = value();
    await setKey("config_customENVs", config.customENVs);
    return NOOP;
  }

  createEffect(() => {
    value();
    onSave(true);
  });

  return [
    function UI() {
      return (
        <FormControl id="customENVs">
          <FormLabel>{locale.get("SETTING_CUSTOM_ENVS")}</FormLabel>
          <InputGroup>
            <Input value={value()} onChange={e => setValue(e.target.value)} />
          </InputGroup>
        </FormControl>
      );
    },
  ] as const;
}
