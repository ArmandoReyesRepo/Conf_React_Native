import React,{ Component } from 'react';
import { View, Text,ScrollView, FlatList, Modal, Button, StyleSheet} from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (comment) => dispatch(postComment(comment))
})
    


function RenderDish(props) {
    const dish = props.dish;

    if( dish != null) {
        return(
            <Card
                featuredTitle = {dish.name}
                image = {{uri: baseUrl + dish.image}}
                >
                <Text style ={{margin:10}}>
                    {dish.description}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Icon  
                        raised
                        reverse
                        name = {props.favorite ? 'heart':'heart-o'}
                        type = 'font-awesome'
                        color = '#f50'
                        onPress = {()=> props.favorite ? console.log('Already favorite') : props.onPress() }
                    />
                    <Icon  
                        raised
                        reverse
                        name = {'pencil'}
                        type = 'font-awesome'
                        color = '#512DA8'
                        onPress = {()=> props.toggleModal()}
                    />
                </View>
            </Card>
        );
    }
        else {
            return( <View></View>)
        }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({item, index}) => {
        return (
            <View key={index} style= {{margin:10}}>
                <Text style ={{fontSize:14}}> {item.comment}</Text>
                <Text style ={{fontSize: 12}}> {item.rating + ' Stars'}  </Text>
                <Text style ={{fontSize:12}}> {'--' + item.author +', ' + item.date}</Text> 
            </View>
        );
    }
    return (
        <Card title = "Comments">
            <FlatList
                data = {comments}
                renderItem = {renderCommentItem}
                keyExtractor = {item=>item.id.toString()}
                />
        </Card>
    );
}
class Dishdetail extends Component {

    constructor (props) {
        super(props);
        this.state = {
            favorites: [],
            showModal: false,
            userRating: 3,
            author:'',
            comment: ''
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.ratingComplete = this.ratingComplete.bind(this);
    }

 

    toggleModal(){
        this.setState({showModal: !this.state.showModal})
    } 

    ratingComplete(rating) {
        //console.log("Rating is: " + this.state.userRating)
        this.setState({userRating: rating}) 
    }

    handleSubmit(dishId, rating, author, comment) {
        this.toggleModal();
        console.log(dishId, rating, author, comment) // the comments are not the right format.... need to look into this.
        this.props.postComment(dishId, rating, author, comment);
    }


   

    markFavorite (dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    }

    render (){
        const dishId = this.props.navigation.getParam('dishId','')
        return ( 
            <ScrollView>
                <RenderDish dish = {this.props.dishes.dishes[+dishId]}
                 favorite = {this.props.favorites.some(el=>el===dishId)}
                 onPress = {()=> this.markFavorite(dishId)}
                 toggleModal = {this.toggleModal()}
                /> 
                <RenderComments comments = {this.props.comments.comments.filter((comment)=>comment.dishId ===dishId)} />
                <Modal 
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={ () => this.toggleModal() }
                    onRequestClose={ () => this.toggleModal() }
                    >
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Your Comment</Text>
                        <Rating
                            showRating
                            type="star"
                            fractions={1}
                            startingValue={3}
                            imageSize={40}
                            style={{ paddingVertical: 10 }}
                            onFinishRating={ this.ratingComplete }
                        />
                        <Input
                            placeholder="Author"
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            onChangeText={ author => this.setState({ author })}
                        />
                        <Input
                            placeholder="Your Comment"
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={ comment => this.setState({ comment })}
                        />
                        <Button
                            onPress={ () => this.handleSubmit( dishId, this.state.userRating, this.state.author, this.state.comment ) }
                            title="Submit"
                            color="#512DA8"
                            style={{marginTop: 10}}
                            accessibilityLabel="Post your comment"
                        />
                        <Button
                            onPress={this.toggleModal}
                            title="Dismiss"
                            color="#888"
                            accessibilityLabel="Dismiss modal"
                        />
                        
                    </View>
                </Modal>
            </ScrollView>
        );
    }
    
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(Dishdetail);