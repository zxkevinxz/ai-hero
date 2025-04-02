import { generateObject, type Message } from "ai";
import {
  getNextStepPrompt,
  type ContextNeededForPrompt,
} from "./get-next-step.prompt";
import { getNextStepSchema } from "./get-next-step.schema";
import { generalUseModel } from "./models";
import { writeFile } from "node:fs/promises";

export const getNextStep = async (opts: {
  context: ContextNeededForPrompt;
  messages: Array<Message>;
}) => {
  const prompt = getNextStepPrompt(opts.context);

  const result = await generateObject({
    model: generalUseModel,
    schema: getNextStepSchema,
    system: prompt,
    messages: opts.messages,
  });

  await writeFile(`./prompt-${opts.context.step}.local.txt`, prompt);

  return result.object;
};
