#Initialising install path and IP address of host
installpath="/var/www/html";
installpath1=$(echo "$installpath" | sed 's/\//\\\//g');
ipv4address=$(hostname -I);

#Initialising colours
red=`tput setaf 1`;
green=`tput setaf 2`;
reset=`tput sgr0`;

#user input for directory details
read -p "Website Domain: " websitedomain;
read -p "MySQL Root Username: " mysqluser;
echo "MySQL Root Password:";
read -s mysqlpass;
read -p "Website Database Name: " mysqlwuser;
read -p "Website Admin Email: " adminemail;
echo "Website Password:";
read -s mysqlwpass;
read -p "Include SSL for www extension [y/n]: " wwwssl;

#ARE YOU SURE prompt
#yes, no or cancel
read -rp "You're about to create a folder, NginX config and MySQL database for $websitedomain at location $installpath/$websitedomain. Are you sure you wish to proceed [y/n/c]: ";

#choosing cancelled in ARE YOU SURE prompt
[[ ${REPLY,,} =~ ^(c|cancel|C|CANCEL|Cancel)$ ]] && {
	echo "Website not created. Action cancelled.";
	exit 1;
}

#choosing yes in ARE YOU SURE prompt
if [[ ${REPLY,,} =~ ^(y|yes|Y|YES|Yes)$ ]]; then

	if [ -d "$installpath/$websitedomain/" ];
	then
		echo "${red}ERROR:${reset} A directory already exists on the path $installpath/$websitedomain.";
	else
	
		if [ -n "$websitedomain" ] && [ -n "$mysqluser" ] && [ -n "$mysqlpass" ] && [ -n "$mysqlwuser" ] && [ -n "$adminemail" ] && [ -n "$mysqlwpass" ]
		then
			#get tribe from github
			sudo git clone https://github.com/wil-ldf-ire/tribe.git $installpath/$websitedomain;

			#remove .git folder
			cd $installpath/$websitedomain;
			sudo rm -rf .git;

			#prepare website.sh for execution
			#replace placeholders with user inputs in website.sh file
			sudo sed -i "s/xyz.com/$websitedomain/g" $installpath/$websitedomain/install/website.sh;
			sudo sed -i "s/ipv4_address/$ipv4address/g" $installpath/$websitedomain/install/website.sh;
			sudo sed -i "s/mysql_root_user/$mysqluser/g" $installpath/$websitedomain/install/website.sh;
			sudo sed -i "s/mysql_root_pass/$mysqlpass/g" $installpath/$websitedomain/install/website.sh;
			sudo sed -i "s/admin_email/$adminemail/g" $installpath/$websitedomain/install/website.sh;
			sudo sed -i "s/install_path/$installpath1/g" $installpath/$websitedomain/install/website.sh;
			sudo sed -i "s/mysql_w_user/$mysqlwuser/g" $installpath/$websitedomain/install/website.sh;
			sudo sed -i "s/mysql_w_pass/$mysqlwpass/g" $installpath/$websitedomain/install/website.sh;
			sudo sed -i "s/www_ssl/$wwwssl/g" $installpath/$websitedomain/install/website.sh;

			#run website.sh
			sudo bash $installpath/$websitedomain/install/website.sh;

			#display success message
			echo -e "\r\n### -----------------\r\n";
			echo "${green}Website successfully created.${reset}";
			echo -e "\r\n### -----------------\r\n";
		
		else
			echo "${red}ERROR:${reset} Website details not defined. All fields are compulsory. Please try again.";
		fi

	fi

#choosing no or invalid input in ARE YOU SURE prompt
else
	echo "Website not created. Action cancelled.";
fi