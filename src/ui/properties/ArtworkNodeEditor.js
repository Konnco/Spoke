import React from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import NumericInputGroup from "../inputs/NumericInputGroup";
import ImageInput from "../inputs/ImageInput";
import { Image } from "styled-icons/fa-solid/Image";
import useSetPropertySelected from "./useSetPropertySelected";

export default function ArtworkNodeEditor(props) {
  const { editor, node } = props;
  const onChangeSrc = useSetPropertySelected(editor, "src");
  const onChangeWidth = useSetPropertySelected(editor, "width");

  return (
    <NodeEditor description={ArtworkNodeEditor.description} {...props}>
      <InputGroup name="Artwork Url">
        <ImageInput value={node.src} onChange={onChangeSrc} />
      </InputGroup>
      <NumericInputGroup
        name="Width"
        min={0}
        smallStep={0.1}
        mediumStep={1}
        largeStep={10}
        value={node.width}
        onChange={onChangeWidth}
        unit="m"
      />
    </NodeEditor>
  );
}

ArtworkNodeEditor.propTypes = {
  editor: PropTypes.object,
  node: PropTypes.object,
  multiEdit: PropTypes.bool
};

ArtworkNodeEditor.iconComponent = Image;
ArtworkNodeEditor.description = "Add MayinArt artwork image.";
