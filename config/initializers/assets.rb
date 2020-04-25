# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path
# Add Yarn node_modules folder to the asset load path.
Rails.application.config.assets.paths << Rails.root.join('node_modules')
Rails.application.config.assets.paths << Rails.root.join('app', 'assets', 'fonts')

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
Rails.application.config.assets.precompile += %w( style.scss plugins/common/common.min.js
  js/custom.min.js js/settings.js js/gleek.js js/styleSwitcher.js plugins/animate/animate.min.css
  plugins/metismenu/css/metisMenu.min.css plugins/metismenu/js/metisMenu.min.js
  plugins/bootstrap-select/dist/css/bootstrap-select.min.css icons/pe-icon-set-weather/css/pe-icon-set-weather.min.css
  icons/material-design-iconic-font/materialdesignicons.min.css icons/weather-icons/css/weather-icons.min.css
  icons/flag-icon-css/flag-icon.min.css icons/themify-icons/themify-icons.css icons/cryptocoins/css/cryptocoins.css
  icons/cryptocoins/css/cryptocoins-colors.css icons/ionicons/css/ionicons.css icons/linea-icons/linea.css
  icons/simple-line-icons/css/simple-line-icons.css icons/font-awesome/css/font-awesome.min.css
  plugins/highlightjs/highlight.pack.min )
