
const WebContainerPreview = () => {
  return (
    <div>
      <h2>WebContainer Preview</h2>
      {/* Insérez ici l'iframe avec l'URL du WebContainer */}
      <iframe
        src="/webcontainer/"
        width="800"
        height="600"
        title="WebContainer Preview"
        sandbox="allow-scripts allow-forms allow-popups allow-modals allow-storage-access-by-user-activation allow-same-origin"
        allow="cross-origin-isolated"
      />
    </div>
  );
};

export default WebContainerPreview;