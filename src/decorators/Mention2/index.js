import Mention2 from "./Mention2";
import Suggestion from "./Suggestion";

const getDecorators = (config) => [
  new Mention2(config.mention2ClassName).getMention2Decorator(),
  new Suggestion(config).getSuggestionDecorator(),
];

export default getDecorators;
