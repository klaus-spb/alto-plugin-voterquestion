<?php
/* ---------------------------------------------------------------------------
 * @Project: Alto CMS
 * @Plugin Name: VoterQuestion
 * @Author: Klaus
 * @License: GNU GPL v2 & MIT
 *----------------------------------------------------------------------------
 */
 
class PluginVoterquestion_HookVoterquestion extends Hook {

    /*
     * Регистрация событий на хуки
     */
    public function RegisterHook() {
		$this->AddHook('template_layout_body_end', 'AddVoterquestiondiv', __CLASS__); 
	}
	
	
	Public function AddVoterquestiondiv(){
		return $this->Viewer_Fetch(Plugin::GetTemplatePath(__CLASS__).'tpls/inject.votequestiondiv.tpl');
	}
	
}