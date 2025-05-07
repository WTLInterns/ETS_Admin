import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null
  },
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    }
  }
});

// Initial state slices
const driversSlice = createSlice({
  name: 'drivers',
  initialState: [],
  reducers: {
    addDriver: (state, action) => {
      state.push(action.payload);
    },
    removeDriver: (state, action) => {
      return state.filter(driver => driver.id !== action.payload);
    },
    updateDriver: (state, action) => {
      const index = state.findIndex(driver => driver.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    }
  }
});

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState: [],
  reducers: {
    addVehicle: (state, action) => {
      state.push(action.payload);
    },
    removeVehicle: (state, action) => {
      return state.filter(vehicle => vehicle.id !== action.payload);
    },
    updateVehicle: (state, action) => {
      const index = state.findIndex(vehicle => vehicle.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    }
  }
});

const employeesSlice = createSlice({
  name: 'employees',
  initialState: [],
  reducers: {
    addEmployee: (state, action) => {
      state.push(action.payload);
    },
    removeEmployee: (state, action) => {
      return state.filter(employee => employee.id !== action.payload);
    },
    updateEmployee: (state, action) => {
      const index = state.findIndex(employee => employee.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    }
  }
});

const pairingsSlice = createSlice({
  name: 'pairings',
  initialState: {
    driverPairings: [],
    employeePairings: []
  },
  reducers: {
    addDriverPairing: (state, action) => {
      state.driverPairings.push(action.payload);
    },
    addEmployeePairing: (state, action) => {
      state.employeePairings.push(action.payload);
    },
    removeDriverPairing: (state, action) => {
      state.driverPairings = state.driverPairings.filter(
        pairing => pairing.id !== action.payload
      );
    },
    removeEmployeePairing: (state, action) => {
      state.employeePairings = state.employeePairings.filter(
        pairing => pairing.id !== action.payload
      );
    }
  }
});

// Configure store
const appStore = configureStore({
  reducer: {
    auth: authSlice.reducer,
    drivers: driversSlice.reducer,
    vehicles: vehiclesSlice.reducer,
    employees: employeesSlice.reducer,
    pairings: pairingsSlice.reducer
  }
});

export const {
  setAuth,
  logout
} = authSlice.actions;

export const {
  addDriver,
  removeDriver,
  updateDriver
} = driversSlice.actions;

export const {
  addVehicle,
  removeVehicle,
  updateVehicle
} = vehiclesSlice.actions;

export const {
  addEmployee,
  removeEmployee,
  updateEmployee
} = employeesSlice.actions;

export const {
  addDriverPairing,
  addEmployeePairing,
  removeDriverPairing,
  removeEmployeePairing
} = pairingsSlice.actions;

export default appStore; 