import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./styles.css";

class Mention2 {
  constructor(className) {
    this.className = className;
  }
  getMention2Component = () => {
    const className = this.className;
    const Mention2Component = ({ entityKey, children, contentState }) => {
      const { url, value } = contentState.getEntity(entityKey).getData();
      return (
        <a
          href={url || value}
          className={classNames("rdw-mention2-link", className)}
        >
          {children}
        </a>
      );
    };
    Mention2Component.propTypes = {
      entityKey: PropTypes.number,
      children: PropTypes.array,
      contentState: PropTypes.object,
    };
    return Mention2Component;
  };
  getMention2Decorator = () => ({
    strategy: this.findMention2Entities,
    component: this.getMention2Component(),
  });
}

Mention2.prototype.findMention2Entities = (
  contentBlock,
  callback,
  contentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "MENTION2"
    );
  }, callback);
};

export default Mention2;
