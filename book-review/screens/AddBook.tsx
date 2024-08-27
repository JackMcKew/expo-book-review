import * as React from 'react';
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';

const MyComponent = () => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  return (
    <PaperProvider>
     
      <Button style={{marginTop: 30}} onPress={showModal}>
        Show
      </Button>
    </PaperProvider>
  );
};

export default MyComponent;