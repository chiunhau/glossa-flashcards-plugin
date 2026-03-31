chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "create-flashcard",
		title: "Create Glossa Flashcard from Selection",
		contexts: ["selection"],
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "create-flashcard" && info.selectionText && tab?.id) {
		const text = encodeURIComponent(info.selectionText.trim());
		const uri = `obsidian://glossa-flashcards?text=${text}`;
		chrome.tabs.update(tab.id, { url: uri });
	}
});
