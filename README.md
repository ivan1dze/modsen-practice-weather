# Weather project

- Author : Ivan Yakovets
- Group : 5
- Figma of weather project : https://www.figma.com/design/WYInme5fVlrXAqJGRldHk5/Untitled?node-id=0-1&t=nhzC8DwOnicPf937-0

## Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key_here
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```
   You can use `.env.example` as a template.
4. Run `npm start` to start the development server

## Scripts

- `npm start` - Start the development server
- `npm run build` - Build the production bundle
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
