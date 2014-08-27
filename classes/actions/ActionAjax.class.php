<?php
/* ---------------------------------------------------------------------------
 * @Project: Alto CMS
 * @Plugin Name: VoterQuestion
 * @Author: Klaus
 * @License: GNU GPL v2 & MIT
 *----------------------------------------------------------------------------
 */
 
class PluginVoterquestion_ActionAjax extends PluginVoterquestion_Inherits_ActionAjax {	
	
	
	public function Init() {
		parent::Init();
		$this->oUserCurrent=$this->User_GetUserCurrent();
	}
	
	protected function RegisterEvent() {	
		parent::RegisterEvent();
		$this->AddEventPreg('/^vote$/i','/^whovotequestion$/','EventWhoVoteQuestion');  
	}
	

	protected function EventWhoVoteQuestion() {
		if(!$this->oUserCurrent){
			$this->Message_AddErrorSingle($this->Lang_Get('need_authorization'),$this->Lang_Get('error'));
			return;
		}		
		$this->Viewer_SetResponseAjax('json');
		$id=0;
		$num=0;
		if (func_check(getRequest('id',null,'post'),'id',1,11))$id=getRequest('id',null,'post');
		if (func_check(getRequest('num',null,'post'),'id',1,3))$num=getRequest('num',null,'post');
		
		if (!($oTopic=$this->Topic_GetTopicById($id))) {
			$this->Message_AddErrorSingle($this->Lang_Get('system_error'),$this->Lang_Get('error'));
			return;
		}		
		
		$aVotes=$this->PluginVoterquestion_Topic_GetUserVotesQuestion($id,$num);
		$this->Viewer_AssignAjax('count_votes',count($aVotes));
		$this->Viewer_AssignAjax('votes',$aVotes);
		
		$strange_array = array();
		$strange_array = $this->Lang_Get('plugin');
		
		$this->Viewer_AssignAjax('vote_for_this',$strange_array['voterquestion']['vote_for_this'] );
		
	}
	
	

}

?>