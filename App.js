import { NavigationContainer } from "@react-navigation/native"
import RootStack from "./screens/RootStack"
import { UserContextProvider } from "./Context/UserContext";

const App = ()=>{
  return(
    <UserContextProvider>
      <NavigationContainer>
        <RootStack/>
      </NavigationContainer>
    </UserContextProvider>

  )
}

export default App;