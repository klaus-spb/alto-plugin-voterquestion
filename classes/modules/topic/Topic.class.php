<?php
/* ---------------------------------------------------------------------------
 * @Project: Alto CMS
 * @Plugin Name: VoterQuestion
 * @Author: Klaus
 * @License: GNU GPL v2 & MIT
 *----------------------------------------------------------------------------
 */
 
class PluginVoterquestion_ModuleTopic extends Module {
	/**
	 * Дополнительная обработка топиков
	 *
	 * @return unknown
	 */
	public function Init() {
		$this->oMapper = Engine::GetMapper(__CLASS__);
	}
	public function GetUserVotesQuestion($FromWhere, $id) {
		$data = $this->oMapper->GetUserVotesQuestion($FromWhere, $id);
		return $data;
	}


}
?>