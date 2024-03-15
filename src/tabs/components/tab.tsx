import styled from "styled-components";
import { useTabsStore } from "../utility/stateHooks";
import { COLORS } from "../utility/constants";
import { MdDelete, MdDone, MdEdit } from "react-icons/md";
import { useRef, useState } from "react";

const TabWrapper = styled.div`
  height: 40px;
  background-color: ${COLORS.SECONDARY}40;
  border-radius: 10px;
  padding: 5px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconImage = styled.img`
  min-width: 20px;
  min-height: 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const TabTitle = styled.div`
  color: ${COLORS.FONT};
  font-weight: bold;
  white-space: nowrap;
  width: 300px;
  text-overflow: ellipsis;
  cursor: pointer;
  overflow: hidden;
`;

const TabUrl = styled.div`
  color: ${COLORS.FONT};
  white-space: nowrap;
  width: 300px;
  text-overflow: ellipsis;
  cursor: pointer;
  overflow: hidden;
`;

const TabTimeStamp = styled.div`
  color: ${COLORS.FONT};
  white-space: nowrap;
  width: 100px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const TabTagsWrapper = styled.div`
  display: flex;
  gap: 5px;
  flex-grow: 1;
`;

const TagsEditInput = styled.input`
  background: none;
  border: none;
  outline: none;
  width: 100%;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 9999px;
  box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
  color: ${COLORS.FONT};
`;

const TabTag = styled.div`
  padding: 5px 10px;
  background-color: ${COLORS.TERTIARY}30;
  color: ${COLORS.FONT};
  border-radius: 10px;
`;

const TabButton = styled.button<{ color: string }>`
  width: 30px;
  height: 30px;
  background-color: ${({ color }) => color};
  border-radius: 6px;
  padding: 5px;
  svg {
    width: 100%;
    height: 100%;
    color: ${COLORS.FONT};
  }
`;

const Tab = ({ url }: { url: string }) => {
  const tagsInputRef = useRef<HTMLInputElement | null>(null);
  const { tabs, updateTags, deleteTab } = useTabsStore((state) => state);
  const { iconUrl, title, timestamp, tags } = tabs[url];
  const [isEditing, toggleEditing] = useState(false);
  const handleEdit = () => {
    toggleEditing((state) => !state);
  };
  const handleDone = () => {
    const inputValue = tagsInputRef.current?.value;
    updateTags(url, inputValue ?? "");
    toggleEditing(false);
  };
  const handleDelete = () => {
    deleteTab(url);
  };
  const handleKeyPress = (e: any) => {
    console.log(e);
    if (e.keyCode === 27) handleEdit();
    if (e.keyCode === 13) handleDone();
  };
  const openUrl = () => {
    window.open(url, "_blank");
  };
  return (
    <TabWrapper>
      <IconImage src={iconUrl} alt={`${title} icon url: ${iconUrl}`} onClick={openUrl} />
      <TabTitle onClick={openUrl}>{title}</TabTitle>
      <TabUrl onClick={openUrl}>{url}</TabUrl>
      <TabTimeStamp>{new Date(timestamp).toLocaleDateString("en-US")}</TabTimeStamp>
      <TabTagsWrapper>{isEditing ? <TagsEditInput autoFocus onKeyUp={handleKeyPress} ref={tagsInputRef} defaultValue={tags.join(", ")} /> : tags.map((tag) => tag && <TabTag key={`${url} ${tag}`}>{tag}</TabTag>)}</TabTagsWrapper>
      {isEditing && (
        <TabButton color={COLORS.GREEN} onClick={handleDone}>
          <MdDone />
        </TabButton>
      )}
      <TabButton color={COLORS.GRAY} onClick={handleEdit}>
        <MdEdit />
      </TabButton>
      <TabButton color={COLORS.RED} onClick={handleDelete}>
        <MdDelete />
      </TabButton>
    </TabWrapper>
  );
};

export default Tab;
