import React from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import NumericInputGroup from "../inputs/NumericInputGroup";
import ImageInput from "../inputs/ImageInput";
import StringInput from "../inputs/StringInput";
import { Image } from "styled-icons/fa-solid/Image";
import useSetPropertySelected from "./useSetPropertySelected";

export default function ArtworkNodeEditor(props) {
  const { editor, node } = props;
  const onChangeSrc = useSetPropertySelected(editor, "src");
  const onChangeWidth = useSetPropertySelected(editor, "width");
  const onChangeHeight = useSetPropertySelected(editor, "height");
  const onChangeTitle = useSetPropertySelected(editor, "title");
  const onChangeArtist = useSetPropertySelected(editor, "artist");
  const onChangeMedium = useSetPropertySelected(editor, "medium");
  const onChangeStyle = useSetPropertySelected(editor, "style");
  const onChangeUrl = useSetPropertySelected(editor, "url");

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
      <NumericInputGroup
        name="Height"
        min={0}
        smallStep={0.1}
        mediumStep={1}
        largeStep={10}
        value={node.height}
        onChange={onChangeHeight}
        unit="m"
      />
      <InputGroup name="Artwork Title">
        <StringInput value={node.title} onChange={onChangeTitle} />
      </InputGroup>
      <InputGroup name="Artwork Artist">
        <StringInput value={node.artist} onChange={onChangeArtist} />
      </InputGroup>
      <InputGroup name="Artwork Medium">
        <StringInput value={node.medium} onChange={onChangeMedium} />
      </InputGroup>
      <InputGroup name="Artwork Style">
        <StringInput value={node.style} onChange={onChangeStyle} />
      </InputGroup>
      <InputGroup name="Website Url">
        <StringInput value={node.url} onChange={onChangeUrl} />
      </InputGroup>
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
