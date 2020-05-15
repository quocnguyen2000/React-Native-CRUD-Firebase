import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import {
  TextInput,
  Button,
  Snackbar,
  Portal,
  Dialog, 
  Paragraph,
  Provider as PaperProvider
} from "react-native-paper";

import { db } from './src/config/config'
import { Platform } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.tasksRef = db.ref("/items");

    const dataSource = [];
    this.state = {
      dataSource: dataSource,
      selecteditem: null,
      snackbarVisible: false,
      confirmVisible: false
    };
  }

  componentDidMount() {
    // start listening for firebase updates
    this.listenForTasks(this.tasksRef);
  }

  listenForTasks(tasksRef) {
    tasksRef.on("value", dataSnapshot => {
      var tasks = [];
      dataSnapshot.forEach(child => {
        tasks.push({
          name: child.val().name,
          key: child.key
        });
      });

      this.setState({
        dataSource: tasks
      });
    });
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          width: "90%",
          height: 2,
          backgroundColor: "#BBB5B3"
        }}
      >
        <View />
      </View>
    );
  };

  //XOÁ
  deleteItem(item) {
    this.setState({ deleteItem: item, confirmVisible: true });
  }

  performDeleteItem(key) {
    var updates = {};
    updates["/items/" + key] = null;
    return db
      .ref()
      .update(updates);
  }

  addItem(itemName) {
    var newPostKey = db
      .ref()
      .child("items")
      .push().key;


    var updates = {};
    updates["/items/" + newPostKey] = {
      name:
        itemName === "" || itemName == undefined
          ? this.state.itemname
          : itemName
    };

    return db
      .ref()
      .update(updates);
  }

  updateItem() {

    var updates = {};
    updates["/items/" + this.state.selecteditem.key] = {
      name: this.state.itemname
    };

    return db
      .ref()
      .update(updates);
  }
  //Lưu
  saveItem() {
    if (this.state.selecteditem === null) this.addItem();
    else this.updateItem();

    this.setState({ itemname: "", selecteditem: null });
  }
  //ẩn thông báo 
  hideDialog(yesNo) {
    this.setState({ confirmVisible: false });
    if (yesNo === true) {
      this.performDeleteItem(this.state.deleteItem.key).then(() => {
        this.setState({ snackbarVisible: true });
      });
    }
  }
  //Hiện thông báo
  showDialog() {
    this.setState({ confirmVisible: true });
    console.log("in show dialog");
  }
  //Hoàn tác Xoá
  undoDeleteItem() {
    this.addItem(this.state.deleteItem.name);
  }


  render() {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <ScrollView>
          <Text style={styles.headerList}>Thêm sản phẩm</Text>
            <Text >Tên sản phẩm</Text>
            <TextInput
              label="Name"
              style={{
                height: 50,
                width: 250,
                borderColor: "gray",
                borderWidth: 1
              }}
              onChangeText={text => this.setState({ itemname: text })}
              value={this.state.itemname}
            />
            <View style={{ height: 10 }}></View>
            <Button
              icon={this.state.selecteditem === null ? "add" : "update"}
              mode="contained"
              onPress={() => this.saveItem()}
            >
              {this.state.selecteditem === null ? "Thêm" : "Sửa"}
            </Button>
            <View style={{ height: 20 }}></View>
            <Text style={styles.headerList}>Danh sách sản phẩm</Text>
            
            
            <FlatList
              data={this.state.dataSource}
              renderItem={({ item }) => (
                <View>
                  <ScrollView horizontal={true}>
                    <TouchableWithoutFeedback>
                      <View style={{ paddingTop: 10 }}>
                        <Text
                          style={{ color: "#4B0082" }}
                          onPress={() => this.deleteItem(item)}
                        >
                          <Icon name="md-trash" size={20} />
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.setState({
                          selecteditem: item,
                          itemname: item.name
                        })
                      }
                    >
                      <View>
                        <Text style={styles.item}>{item.name} </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </ScrollView>
                </View>
              )}
              ItemSeparatorComponent={this.renderSeparator}
            />
            <Text />


            <Portal>
              <Dialog
                visible={this.state.confirmVisible}
                onDismiss={() => this.hideDialog(false)}
              >
                <Dialog.Title>Thông báo</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Bạn muốn xoá sản phẩm này?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => this.hideDialog(true)}>OK</Button>
                  <Button onPress={() => this.hideDialog(false)}>huỷ</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </ScrollView>
          <Snackbar
            visible={this.state.snackbarVisible}
            onDismiss={() => this.setState({ snackbarVisible: false })}
            action={{
              label: "Hoàn tác",
              onPress: () => {
                // Do something
                this.undoDeleteItem();
              }
            }}
          >
            Đã xoá thành công sản phẩm !!!.
          </Snackbar>
        </View>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 38 : 22,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    alignItems: "center"
  },
  headerList: {
    padding: 10,
    fontSize: 20,
    height: 50,
    alignItems: "center"
  }
});
