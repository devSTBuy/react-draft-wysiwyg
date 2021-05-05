import { EditorState, Modifier } from "draft-js";
import { getSelectedBlock } from "draftjs-utils";

export default function addMention2(
  editorState: EditorState,
  onChange: Function,
  separator: string,
  trigger: string,
  suggestion: Object
): void {
  const { value, url } = suggestion;
  const entityKey = editorState
    .getCurrentContent()
    .createEntity("MENTION2", "IMMUTABLE", {
      text: `${trigger}${value}`,
      value,
      url,
    })
    .getLastCreatedEntityKey();
  const selectedBlock = getSelectedBlock(editorState);
  const selectedBlockText = selectedBlock.getText();
  let focusOffset = editorState.getSelection().focusOffset;
  const mention2Index =
    (selectedBlockText.lastIndexOf(separator + trigger, focusOffset) || 0) + 1;
  let spaceAlreadyPresent = false;
  if (selectedBlockText.length === mention2Index + 1) {
    focusOffset = selectedBlockText.length;
  }
  if (selectedBlockText[focusOffset] === " ") {
    spaceAlreadyPresent = true;
  }
  let updatedSelection = editorState.getSelection().merge({
    anchorOffset: mention2Index,
    focusOffset,
  });
  let newEditorState = EditorState.acceptSelection(
    editorState,
    updatedSelection
  );
  let contentState = Modifier.replaceText(
    newEditorState.getCurrentContent(),
    updatedSelection,
    `${trigger}${value}`,
    newEditorState.getCurrentInlineStyle(),
    entityKey
  );
  newEditorState = EditorState.push(
    newEditorState,
    contentState,
    "insert-characters"
  );

  if (!spaceAlreadyPresent) {
    // insert a blank space after mention2
    updatedSelection = newEditorState.getSelection().merge({
      anchorOffset: mention2Index + value.length + trigger.length,
      focusOffset: mention2Index + value.length + trigger.length,
    });
    newEditorState = EditorState.acceptSelection(
      newEditorState,
      updatedSelection
    );
    contentState = Modifier.insertText(
      newEditorState.getCurrentContent(),
      updatedSelection,
      " ",
      newEditorState.getCurrentInlineStyle(),
      undefined
    );
  }
  onChange(EditorState.push(newEditorState, contentState, "insert-characters"));
}
