fx_version 'adamant'

game 'gta5'

lua54 'yes'

description "made by wl2 store | discord: @wl_2 | WL2 Store: https://discord.gg/wl2"

version '1.0.0'

server_scripts {
	'config.lua',
	'server/main.lua'
}

client_scripts {
	'client/main.lua'
}

escrow_ignore {
	'config.lua'
}

dependency 'es_extended'

shared_script '@es_extended/imports.lua'